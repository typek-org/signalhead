import { format } from "pretty-format";
import { expect } from "@std/expect";

export type Equal<X, Y> =
	(<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
		? true
		: false;

export const expectType = <T>() => ({
	toExtend<U>(..._args: T extends U ? [] : [never]) {},
	toBeExtendedBy<U extends T>() {},
	toBe<U>(..._args: Equal<T, U> extends true ? [] : [never]) {},
});

export const expectTypes = <X, Y>(): Equal<X, Y> extends true
	? { toBeEqual(): void }
	: Record<string, never> => ({ toBeEqual() {} }) as any;

export interface Fn<ReturnValue, Args extends any[]>
	extends jest.Mock<(...args: Args) => ReturnValue> {
	assertCalledOnce(args?: Args, ret?: ReturnValue): void;
	assertNotCalled(): void;
	assertCalledTimes(times: number): void;
}

export const fn = <R, A extends any[]>(
	f?: (...args: A) => R,
): Fn<R, A> => {
	return Object.assign(jest.fn<(...args: A) => R>(f), {
		assertCalledOnce(this: Fn<R, A>, args: A, ret?: R) {
			const calls = this.mock.calls;

			if (arguments.length === 0) {
				if (calls.length === 0) {
					throw new Error(
						"The function was expected to have been called once, " +
							"but it has not been called since the last time.",
					);
				}
				if (calls.length > 1) {
					throw new Error(
						"The function was expected to be called once, " +
							`but it was called ${calls.length} times, with:\n` +
							calls.map((a) => format(a)).join("\n"),
					);
				}

				this.mock.calls.length = 0;
				this.mock.results.length = 0;
				return;
			}

			if (calls.length === 0) {
				throw new Error(
					"The function has not been called since the last time. It " +
						"was expected to be called with the following arguments:\n" +
						format(args),
				);
			}

			if (calls.length > 1) {
				throw new Error(
					"The function was expected to be called once, " +
						`but it was called ${calls.length} times.\n` +
						`Expected: \n${format(args)}\n` +
						`Received: \n${calls.map((a) => format(a)).join("\n")}`,
				);
			}

			try {
				expect(calls[0]).toStrictEqual(args);
			} catch (cause) {
				throw new Error(
					"The function was called with arguments different from " +
						"those that were expected.\n" +
						`Expected: \n${format(args)}\n` +
						`Received: \n${format(calls[0])}`,
					{ cause },
				);
			}
			if (arguments.length > 1) {
				try {
					expect(this.mock.results[0]).toStrictEqual(ret);
				} catch (_) {
					throw new Error(
						"The function returned a value different from " +
							"the expected one.\n" +
							`Expected: \n${format(ret)}\n` +
							`Received: \n${format(this.mock.results[0])}`,
					);
				}
			}

			this.mock.calls.length = 0;
			this.mock.results.length = 0;
		},

		assertNotCalled(this: Fn<R, A>) {
			const calls = this.mock.calls;
			if (calls.length > 0) {
				throw new Error(
					`The function should not have been called. It has been called ${calls.length} times with:\n` +
						calls.map((a) => format(a)).join("\n"),
				);
			}
		},

		assertCalledTimes(this: Fn<R, A>, times: number) {
			const calls = this.mock.calls;
			if (calls.length !== times) {
				throw new Error(
					`The function was expected to have been called ${times} ` +
						`times, but was called ${calls.length} times.`,
				);
			}

			this.mock.calls.length = 0;
			this.mock.results.length = 0;
		},
	});
};

/**
 * Types borrowed from [jest-mock](https://github.com/jestjs/jest/blob/main/packages/jest-mock/src/index.ts#L1082)
 */
// deno-lint-ignore no-namespace
namespace jest {
	type FunctionLike = (...args: any) => any;
	type UnknownFunction = (...args: Array<unknown>) => unknown;
	type ResolveType<T extends FunctionLike> =
		ReturnType<T> extends PromiseLike<infer U> ? U : never;
	type MockFunctionResultIncomplete = {
		type: "incomplete";
		/**
		 * Result of a single call to a mock function that has not yet completed.
		 * This occurs if you test the result from within the mock function itself,
		 * or from within a function that was called by the mock.
		 */
		value: undefined;
	};
	type MockFunctionResultReturn<
		T extends FunctionLike = UnknownFunction,
	> = {
		type: "return";
		/**
		 * Result of a single call to a mock function that returned.
		 */
		value: ReturnType<T>;
	};
	type MockFunctionResultThrow = {
		type: "throw";
		/**
		 * Result of a single call to a mock function that threw.
		 */
		value: unknown;
	};

	type MockFunctionResult<T extends FunctionLike = UnknownFunction> =
		| MockFunctionResultIncomplete
		| MockFunctionResultReturn<T>
		| MockFunctionResultThrow;
	export interface Mock<T extends FunctionLike = UnknownFunction>
		extends Function,
			MockInstance<T> {
		(...args: Parameters<T>): ReturnType<T>;
	}
	export interface MockInstance<
		T extends FunctionLike = UnknownFunction,
	> {
		mock: MockFunctionState<T>;
	}
	type MockFunctionState<T extends FunctionLike = UnknownFunction> = {
		/**
		 * List of the call arguments of all calls that have been made to the mock.
		 */
		calls: Array<Parameters<T>>;
		/**
		 * List of the results of all calls that have been made to the mock.
		 */
		results: Array<MockFunctionResult<T>>;
	};
	export function fn<
		T extends (...args: any) => any = (
			...args: Array<unknown>
		) => unknown,
	>(implementation?: T): Mock<T> {
		const calls: Parameters<T>[] = [];
		const results: MockFunctionResult<T>[] = [];
		return Object.assign(
			(...args: any) => {
				calls.push(args);
				const res = implementation?.(...args);
				results.push(res);
				return res;
			},
			{
				mock: { calls, results },
			},
		);
	}
}
