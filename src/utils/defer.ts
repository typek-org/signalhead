export interface Defer {
	(destructor: () => void): void;
	toAbortSignal: () => AbortSignal;
}

type DeferMethod = (destructor: () => void) => void;

export type DeferLike = DeferMethod | AbortSignal;

export const Defer = {
	from: (deferLike: DeferLike): Defer =>
		typeof deferLike === "function"
			? deferFromCallback(deferLike)
			: deferFromAbortSignal(deferLike),

	create: (): { defer: Defer; cleanup: () => void } => {
		const destructors: Array<() => void> = [];
		const cleanup = () => {
			for (const d of destructors) d();
			destructors.length = 0;
		};
		const defer = Defer.from((d) => destructors.push(d));

		return { defer, cleanup };
	},

	earliest: (...args: Defer[]): Defer => {
		const { defer, cleanup } = Defer.create();
		for (const d of args) d(cleanup);
		return defer;
	},

	latest: (...args: Defer[]): Defer => {
		const { defer, cleanup } = Defer.create();

		const waitingFor = new Set(args);
		const onAllCompleted = () => {
			cleanup();
			for (const d of args) waitingFor.add(d);
		};

		for (const d of args) {
			d(() => {
				waitingFor.delete(d);
				if (waitingFor.size === 0) onAllCompleted();
			});
		}

		return defer;
	},
};

const deferFromCallback = (f: DeferMethod): Defer =>
	Object.assign(f, {
		toAbortSignal: () => {
			const controller = new AbortController();
			f(() => controller.abort());
			return controller.signal;
		},
	});

const deferFromAbortSignal = (signal: AbortSignal): Defer => {
	const f: DeferMethod = (d) => signal.addEventListener("abort", d);
	return Object.assign(f, {
		toAbortSignal: () => signal,
	});
};
