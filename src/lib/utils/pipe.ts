// Types inspired by https://dev.to/ecyrbe/how-to-use-advanced-typescript-to-define-a-pipe-function-381h

type AnyFn = (v: any) => any;

type LastFnReturnType<F extends AnyFn[], Else = never> = F extends [
	...any[],
	(...arg: any) => infer R,
]
	? R
	: AnyFn[] extends F
		? any
		: Else;

type PipeArgs<
	F extends AnyFn[],
	Acc extends AnyFn[] = [],
> = F extends [(v: infer A) => infer B]
	? [...Acc, (v: A) => B]
	: F extends [(v: infer A) => any, ...infer Tail]
		? Tail extends [(arg: infer B) => any, ...any[]]
			? PipeArgs<Tail, [...Acc, (v: A) => B]>
			: Acc
		: Acc;

export function pipe<A, B>(value: A, f: (v: A) => B): B;
export function pipe<A, B, C>(
	value: A,
	f: (v: A) => B,
	g: (v: B) => C,
): C;
export function pipe<A, B, C, D>(
	value: A,
	f: (v: A) => B,
	g: (v: B) => C,
	h: (v: C) => D,
): D;
export function pipe<A, B, C, D, E>(
	value: A,
	f: (v: A) => B,
	g: (v: B) => C,
	h: (v: C) => D,
	i: (v: D) => E,
): E;
export function pipe<A, B, C, D, E, F>(
	value: A,
	f: (v: A) => B,
	g: (v: B) => C,
	h: (v: C) => D,
	i: (v: D) => E,
	j: (v: E) => F,
): F;
export function pipe<A, B, C, D, E, F, G>(
	value: A,
	f: (v: A) => B,
	g: (v: B) => C,
	h: (v: C) => D,
	i: (v: D) => E,
	j: (v: E) => F,
	k: (v: F) => G,
): F;
export function pipe<F extends AnyFn[]>(
	arg: Parameters<F[0]>[0],
	...fns: PipeArgs<F> extends F ? F : PipeArgs<F>
): LastFnReturnType<F>;

export function pipe(value: any, ...fns: AnyFn[]): any {
	return fns.reduce((v, f) => f(v), value);
}

export interface PipeOf<A> {
	pipe<B>(f: (v: A) => B): B;
	pipe<B, C>(f: (v: A) => B, g: (v: B) => C): C;
	pipe<B, C, D>(f: (v: A) => B, g: (v: B) => C, h: (v: C) => D): D;
	pipe<B, C, D, E>(
		f: (v: A) => B,
		g: (v: B) => C,
		h: (v: C) => D,
		i: (v: D) => E,
	): E;
	pipe<B, C, D, E, F>(
		f: (v: A) => B,
		g: (v: B) => C,
		h: (v: C) => D,
		i: (v: D) => E,
		j: (v: E) => F,
	): F;
	pipe<B, C, D, E, F, G>(
		f: (v: A) => B,
		g: (v: B) => C,
		h: (v: C) => D,
		i: (v: D) => E,
		j: (v: E) => F,
		k: (v: F) => G,
	): F;
	pipe<
		F extends AnyFn[],
		FirstFn extends (v: A) => Parameters<F[0]>[0],
	>(
		firstFn: FirstFn,
		...fns: PipeArgs<F> extends F ? F : PipeArgs<F>
	): LastFnReturnType<F, ReturnType<FirstFn>>;
}

export type Pipable<T> = T & PipeOf<Pipable<T>>;

export function pipableOf<T extends object>(obj: T): Pipable<T> {
	return Object.assign(obj, {
		pipe(...fns: AnyFn[]) {
			return pipe(obj, ...fns);
		},
	});
}
