import { format } from "pretty-format";

export interface Fn<ReturnValue, Args extends any[]>
	extends jest.Mock<ReturnValue, Args, any> {
	assertCalledOnce(args?: Args, ret?: ReturnValue): void;
	assertNotCalled(): void;
	assertCalledTimes(times: number): void;
}

export const fn = <R, A extends any[]>(
	f?: (...args: A) => R,
): Fn<R, A> => {
	return Object.assign(jest.fn<R, A>(f), {
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
				} catch (cause) {
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
