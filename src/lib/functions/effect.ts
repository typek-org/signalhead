import type {
	Invalidator,
	MinimalSignal,
	Unsubscriber,
	Validator,
} from "../signals/mod.ts";
import { Signal } from "../signals/mod.ts";

export interface EffectParams {
	defer(destructor: () => void): void;
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
 */
export function effect(
	f: ($: <T>(s: MinimalSignal<T>) => T, params: EffectParams) => void,
	invalidator?: Invalidator,
	validator?: Validator,
): Unsubscriber {
	const deps = new Map<MinimalSignal<any>, Unsubscriber>();
	const dirty = new Set<MinimalSignal<any>>();
	const usedNow = new Set<MinimalSignal<any>>();
	const defered: Array<() => void> = [];
	let changedWhileDirty = false;

	// subscribe to the signal (if not yet subscribed)
	// and return its value
	const $ = <T>(s: MinimalSignal<T>): T => {
		usedNow.add(s);

		if (!deps.has(s)) {
			deps.set(
				s,
				s.subscribe(
					() => {
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
				),
			);
		}

		return Signal.get(s);
	};

	// cleanup code to run before the next update
	const defer = (d: () => void): void => void defered.push(d);

	let running = false;
	const depsChanged = () => {
		if (running) return;
		running = true;

		try {
			// cleanup after previous run
			usedNow.clear();
			for (const d of defered) d();
			defered.length = 0;

			// run the effect
			f($, { defer });

			// unsubscribe from signals that are not currently needed
			for (const [s, u] of deps.entries()) {
				if (usedNow.has(s)) continue;

				u();
				deps.delete(s);
			}
		} finally {
			running = false;
		}
	};

	depsChanged();

	return () => {
		running = true; // prevent depsChanged from doing anything

		for (const d of defered) d();
		for (const u of deps.values()) u();

		deps.clear();
		dirty.clear();
		usedNow.clear();
		defered.length = 0;
	};
}
