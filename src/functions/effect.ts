import { type Pipable, toPipable } from "@typek/typek";
import type {
	Invalidator,
	MinimalSignal,
	Unsubscriber,
	Validator,
} from "../signals/mod.ts";
import { Defer } from "../utils/defer.ts";

export interface EffectParams {
	defer: Defer;
}

/**
 * A convenient way to run side effects of signal updates.
 * The provided `$` function gets the signal's current value
 * and subscribes to future updates. The effect automatically
 * unsubscribes from signals that were not used in the last
 * run – this is usually the right thing to do, but if
 * the callback branches based on some untracked dependency,
 * it might not be what you want. To unsubscribe from all
 * signals and prevent the effect from ever running again,
 * call the returned unsubscriber function. To use a signal
 * without subscribing to it (untracked signal), simply use
 * `s.get()` or `Signal.get(s)` instead of `$(s)`.
 *
 * @example
 * ```ts
 * const name = mut('Josh');
 * const age = mut(25);
 *
 * effect($ => {
 *   const fullName = $(name) + ' Doe';
 *   console.log(`${fullName} is ${$(age)} years old`);
 * });
 * // Josh Doe is 25 years old
 *
 * name.set('Jane'); // Jane Doe is 25 years old
 * age.set(69); // Jane Doe is 69 years old
 * ```
 */
export function effect(
	f: ($: <T>(s: MinimalSignal<T>) => T, params: EffectParams) => void,
	invalidator?: Invalidator,
	validator?: Validator,
): Pipable<Unsubscriber> {
	const deps = new Map<MinimalSignal<any>, Unsubscriber>();
	const values = new Map<MinimalSignal<any>, any>();
	const dirty = new Set<MinimalSignal<any>>();
	const usedNow = new Set<MinimalSignal<any>>();
	let changedWhileDirty = false;

	// subscribe to the signal (if not yet subscribed)
	// and return its value
	const $ = <T>(s: MinimalSignal<T>): T => {
		usedNow.add(s);

		if (!deps.has(s)) {
			const unsub = s.subscribe(
				(v) => {
					values.set(s, v);
					dirty.delete(s);
					if (dirty.size === 0) {
						changedWhileDirty = false;
						depsChanged();
					} else {
						changedWhileDirty = true;
					}
				},
				() => {
					if (dirty.size === 0) invalidator?.();
					dirty.add(s);
				},
				() => {
					dirty.delete(s);
					if (dirty.size === 0) {
						if (changedWhileDirty) {
							changedWhileDirty = false;
							depsChanged();
						} else {
							validator?.();
						}
					}
				},
			);

			deps.set(s, () => {
				unsub();
				values.delete(s);
				dirty.delete(s);
				deps.delete(s);
			});
		}

		return values.get(s);
	};

	// cleanup code to run before the next update
	const { defer, cleanup } = Defer.create();

	let running = false;
	const depsChanged = () => {
		if (running) return;
		running = true;

		try {
			// cleanup after previous run
			usedNow.clear();
			cleanup();

			// run the effect
			f($, { defer });

			// unsubscribe from signals that are not currently needed
			for (const [s, u] of deps.entries()) {
				if (usedNow.has(s)) continue;

				u();
				deps.delete(s);
				values.delete(s);
				dirty.delete(s);
			}
		} finally {
			running = false;
		}
	};

	depsChanged();

	return toPipable(() => {
		running = true; // prevent depsChanged from doing anything

		cleanup();
		for (const u of deps.values()) u();

		deps.clear();
		dirty.clear();
		usedNow.clear();
	});
}
