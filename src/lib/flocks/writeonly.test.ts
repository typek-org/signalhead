import { FlockUpdate, WriteonlyFlock } from "./mod.ts";

describe("writeonly flock", () => {
	test("basic", () => {
		const s = WriteonlyFlock<number>();

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
