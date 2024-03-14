import { fn } from "../utils/testUtils.ts";
import { FlockUpdate, MutFlock } from "./mod.ts";

describe("writable flock", () => {
	test("basic", () => {
		const s = MutFlock([1, 2, 3]);

		const f = fn<void, [Set<number>]>();
		const u = s.toSet().subscribe((x) => f(x));

		f.assertCalledOnce([new Set([1, 2, 3])]);

		s.add(0);
		f.assertCalledOnce([new Set([0, 1, 2, 3])]);

		s.delete(2);
		f.assertCalledOnce([new Set([0, 1, 3])]);

		s.clear();
		f.assertCalledOnce([new Set([])]);

		u();
	});

	test("updates", () => {
		const s = MutFlock([1, 2, 3]);

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
