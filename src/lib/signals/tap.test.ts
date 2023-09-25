import { TappedSignal } from "./tap.ts";
import { mut } from "./writable.ts";

describe("tap", () => {
	test("basic get & subscribe", () => {
		for (const method of [true, false]) {
			const a = mut("hello");

			const f = jest.fn<void, [string]>();
			const b = method ? a.tap(f) : TappedSignal(a, f);

			expect(f).not.toBeCalled();

			const g = jest.fn<void, [string]>();
			const u = b.subscribe((x) => g(x));
			expect(f).toBeCalledTimes(1);
			expect(f).lastCalledWith("hello");
			expect(g).toBeCalledTimes(1);
			expect(g).lastCalledWith("hello");

			a.set("world");
			expect(f).toBeCalledTimes(2);
			expect(f).lastCalledWith("world");
			expect(g).toBeCalledTimes(2);
			expect(g).lastCalledWith("world");

			u();
			a.set("sike");
			expect(f).toBeCalledTimes(2);
			expect(g).toBeCalledTimes(2);
		}
	});
});
