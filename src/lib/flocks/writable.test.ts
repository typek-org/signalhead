import { FlockUpdate, MutFlock } from "./mod.ts";

describe("writable flock", () => {
	test("basic", () => {
		const s = MutFlock([1, 2, 3]);

		const f = jest.fn<void, [Set<number>]>();
		const u = s.toSet().subscribe((x) => f(x));

		expect(f).toBeCalledTimes(1);
		expect(f).lastCalledWith(new Set([1, 2, 3]));

		s.add(0);
		expect(f).toBeCalledTimes(2);
		expect(f).lastCalledWith(new Set([0, 1, 2, 3]));

		s.delete(2);
		expect(f).toBeCalledTimes(3);
		expect(f).lastCalledWith(new Set([0, 1, 3]));

		s.clear();
		expect(f).toBeCalledTimes(4);
		expect(f).lastCalledWith(new Set([]));

		u();
	});

	test("updates", () => {
		const s = MutFlock([1, 2, 3]);

		const f = jest.fn<void, [FlockUpdate<number>[]]>();
		const u = s.listenToUpdates((x) => f(x));

		expect(f).not.toBeCalled();

		s.add(0);
		expect(f).toBeCalledTimes(1);
		expect(f).lastCalledWith([{ type: "add", value: 0 }]);

		s.add(42);
		expect(f).toBeCalledTimes(2);
		expect(f).lastCalledWith([{ type: "add", value: 42 }]);

		s.delete(42);
		expect(f).toBeCalledTimes(3);
		expect(f).lastCalledWith([{ type: "delete", value: 42 }]);

		s.clear();
		expect(f).toBeCalledTimes(4);
		expect(f).lastCalledWith([{ type: "clear" }]);

		u();

		s.add(2);
		expect(f).toBeCalledTimes(4);
	});
});
