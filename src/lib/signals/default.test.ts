import {
	SignalWithDefault,
	WritableSignalWithDefault,
} from "./default";
import { mut } from "./writable";

describe("default", () => {
	test("readable", () => {
		for (const method of [true, false]) {
			const a = mut<number>();
			const b = mut(42);
			const c = method ? a.withDefault(b) : SignalWithDefault(a, b);

			const f = jest.fn<void, [number]>();
			const u = c.subscribe((x) => f(x));
			expect(f).toBeCalledTimes(1);
			expect(f).toHaveBeenLastCalledWith(42);

			a.set(69);
			expect(f).toBeCalledTimes(2);
			expect(f).toHaveBeenLastCalledWith(69);

			b.set(-5);
			expect(f).toBeCalledTimes(3); // FIXME there shouldn't be an additional call
			expect(f).toHaveBeenLastCalledWith(69);

			a.set(undefined);
			expect(f).toBeCalledTimes(4);
			expect(f).toHaveBeenLastCalledWith(-5);

			b.set(420);
			expect(f).toBeCalledTimes(5);
			expect(f).toHaveBeenLastCalledWith(420);

			a.set(1312);
			expect(f).toBeCalledTimes(6);
			expect(f).toHaveBeenLastCalledWith(1312);

			u();
			a.set(8);
			b.set(123);
			a.set(undefined);
			b.set(321);
			expect(f).toBeCalledTimes(6);
		}
	});

	test("writable", () => {
		const s = WritableSignalWithDefault(mut<number>(), mut(42));

		const f = jest.fn<void, [number]>();
		const u = s.subscribe((x) => f(x));
		expect(f).toBeCalledTimes(1);
		expect(f).toHaveBeenCalledWith(42);

		s.set(123);
		expect(f).toBeCalledTimes(2);
		expect(f).toHaveBeenCalledWith(123);

		s.set(undefined);
		expect(f).toBeCalledTimes(3);
		expect(f).toHaveBeenCalledWith(42);

		s.default.set(-12);
		expect(f).toBeCalledTimes(4);
		expect(f).toHaveBeenCalledWith(-12);

		u();
		s.default.set(123);
		s.set(321);
		expect(f).toBeCalledTimes(4);
	});
});
