import { fn } from "../utils/testUtils.ts";
import { FlockUpdate, WriteonlyFlock } from "./mod.ts";

describe("writeonly flock", () => {
	test("basic", () => {
		const s = WriteonlyFlock<number>();

		const f = fn<void, [FlockUpdate<number>[]]>();
		const u = s.listenToUpdates((x) => f(x));

		f.assertNotCalled();

		s.add(0);
		f.assertCalledOnce([[{ type: "add", value: 0 }]]);

		s.add(42);
		f.assertCalledOnce([[{ type: "add", value: 42 }]]);

		s.delete(42);
		f.assertCalledOnce([[{ type: "delete", value: 42 }]]);

		s.clear();
		f.assertCalledOnce([[{ type: "clear" }]]);

		u();

		s.add(2);
		f.assertNotCalled();
	});
});
