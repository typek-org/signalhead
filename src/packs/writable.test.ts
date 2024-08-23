import { expect } from "@std/expect";
import { expectType, fn } from "../utils/testUtils.ts";
import type { Pack, PackUpdate } from "./readable.ts";
import { MutPack } from "./writable.ts";

Deno.test("MutList", () => {
	Deno.test("types", <T>() => {
		expectType<MutPack<T>>().toExtend<Pack<T>>();
	});

	Deno.test("basic", () => {
		const pack = MutPack([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
		const listener = fn<void, [sub: PackUpdate<number>[]]>();
		const u = pack.listenToUpdates(listener);

		listener.assertNotCalled();

		expect(pack.length.get()).toBe(10);

		pack.length.set(8);
		listener.assertCalledOnce([
			[
				{ type: "delete", index: 9 },
				{ type: "delete", index: 8 },
			],
		]);
		expect(pack.length.get()).toBe(8);
		expect(pack.toArray().get()).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);

		pack.push(-8, -9, -10);
		listener.assertCalledOnce([
			[
				{ type: "insert", index: 8, value: -8 },
				{ type: "insert", index: 9, value: -9 },
				{ type: "insert", index: 10, value: -10 },
			],
		]);
		expect(pack.length.get()).toBe(11);
		expect(pack.toArray().get()).toEqual([
			0, 1, 2, 3, 4, 5, 6, 7, -8, -9, -10,
		]);

		expect(pack.pop()).toBe(-10);
		listener.assertCalledOnce([[{ type: "delete", index: 10 }]]);

		expect(pack.shift()).toBe(0);
		listener.assertCalledOnce([[{ type: "delete", index: 0 }]]);

		pack.deleteAt(5);
		listener.assertCalledOnce([[{ type: "delete", index: 5 }]]);

		expect(pack.popAt(3)).toBe(4);
		listener.assertCalledOnce([[{ type: "delete", index: 3 }]]);

		expect(pack.toArray().get()).toEqual([1, 2, 3, 5, 7, -8, -9]);

		pack.swap(1, 5);
		listener.assertCalledOnce([
			[
				{ type: "move", fromIndex: 1, toIndex: 5 },
				{ type: "move", fromIndex: 4, toIndex: 1 },
			],
		]);
		expect(pack.toArray().get()).toEqual([1, -8, 3, 5, 7, 2, -9]);

		pack.moveToIndex(0, 4);
		listener.assertCalledOnce([
			[{ type: "move", fromIndex: 0, toIndex: 4 }],
		]);
		expect(pack.toArray().get()).toEqual([-8, 3, 5, 7, 1, 2, -9]);
		expect(pack.length.get()).toBe(7);

		pack.shift();
		pack.pop();
		pack.length.set(3);
		listener.assertCalledTimes(3);
		expect(pack.toArray().get()).toEqual([3, 5, 7]);

		pack.insertAt(1, 4);
		listener.assertCalledOnce([
			[{ type: "insert", index: 1, value: 4 }],
		]);
		expect(pack.toArray().get()).toEqual([3, 4, 5, 7]);

		pack.setAt(3, 6);
		listener.assertCalledOnce([
			[{ type: "modify", index: 3, value: 6 }],
		]);
		expect(pack.toArray().get()).toEqual([3, 4, 5, 6]);

		pack.setAt(5, 8);
		listener.assertCalledOnce([
			[
				{ type: "insert", index: 4, value: undefined },
				{ type: "insert", index: 5, value: 8 },
			],
		]);
		expect(pack.toArray().get()).toEqual([3, 4, 5, 6, undefined, 8]);

		pack.length.set(8);
		listener.assertCalledOnce([
			[
				{ type: "insert", index: 6, value: undefined },
				{ type: "insert", index: 7, value: undefined },
			],
		]);
		expect(pack.toArray().get()).toEqual([
			3,
			4,
			5,
			6,
			undefined,
			8,
			undefined,
			undefined,
		]);

		pack.length.set(4);
		listener.assertCalledOnce();

		pack.unshift(0, 1, 2);
		listener.assertCalledOnce([
			[
				{ type: "insert", index: 0, value: 2 },
				{ type: "insert", index: 0, value: 1 },
				{ type: "insert", index: 0, value: 0 },
			],
		]);

		u();
	});
});
