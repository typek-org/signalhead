import { expectType, fn } from "../utils/testUtils.ts";
import { List, ListUpdate } from "./readable.ts";
import { MutList } from "./writable.ts";

describe("MutList", () => {
	test("types", <T>() => {
		expectType<MutList<T>>().toExtend<List<T>>();
	});

	test("basic", () => {
		const list = MutList([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
		const listener = fn<void, [sub: ListUpdate<number>[]]>();
		const u = list.listenToUpdates(listener);

		listener.assertNotCalled();

		expect(list.length.get()).toBe(10);

		list.length.set(8);
		listener.assertCalledOnce([
			[
				{ type: "delete", index: 9 },
				{ type: "delete", index: 8 },
			],
		]);
		expect(list.length.get()).toBe(8);
		expect(list.toArray().get()).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);

		list.push(-8, -9, -10);
		listener.assertCalledOnce([
			[
				{ type: "insert", index: 8, value: -8 },
				{ type: "insert", index: 9, value: -9 },
				{ type: "insert", index: 10, value: -10 },
			],
		]);
		expect(list.length.get()).toBe(11);
		expect(list.toArray().get()).toEqual([
			0, 1, 2, 3, 4, 5, 6, 7, -8, -9, -10,
		]);

		expect(list.pop()).toBe(-10);
		listener.assertCalledOnce([[{ type: "delete", index: 10 }]]);

		expect(list.shift()).toBe(0);
		listener.assertCalledOnce([[{ type: "delete", index: 0 }]]);

		list.deleteAt(5);
		listener.assertCalledOnce([[{ type: "delete", index: 5 }]]);

		expect(list.popAt(3)).toBe(4);
		listener.assertCalledOnce([[{ type: "delete", index: 3 }]]);

		expect(list.toArray().get()).toEqual([1, 2, 3, 5, 7, -8, -9]);

		list.swap(1, 5);
		listener.assertCalledOnce([
			[
				{ type: "move", fromIndex: 1, toIndex: 5 },
				{ type: "move", fromIndex: 4, toIndex: 1 },
			],
		]);
		expect(list.toArray().get()).toEqual([1, -8, 3, 5, 7, 2, -9]);

		list.moveToIndex(0, 4);
		listener.assertCalledOnce([
			[{ type: "move", fromIndex: 0, toIndex: 4 }],
		]);
		expect(list.toArray().get()).toEqual([-8, 3, 5, 7, 1, 2, -9]);
		expect(list.length.get()).toBe(7);

		list.shift();
		list.pop();
		list.length.set(3);
		listener.assertCalledTimes(3);
		expect(list.toArray().get()).toEqual([3, 5, 7]);

		list.insertAt(1, 4);
		listener.assertCalledOnce([
			[{ type: "insert", index: 1, value: 4 }],
		]);
		expect(list.toArray().get()).toEqual([3, 4, 5, 7]);

		list.setAt(3, 6);
		listener.assertCalledOnce([
			[{ type: "modify", index: 3, value: 6 }],
		]);
		expect(list.toArray().get()).toEqual([3, 4, 5, 6]);

		list.setAt(5, 8);
		listener.assertCalledOnce([
			[
				{ type: "insert", index: 4, value: undefined },
				{ type: "insert", index: 5, value: 8 },
			],
		]);
		expect(list.toArray().get()).toEqual([3, 4, 5, 6, undefined, 8]);

		list.length.set(8);
		listener.assertCalledOnce([
			[
				{ type: "insert", index: 6, value: undefined },
				{ type: "insert", index: 7, value: undefined },
			],
		]);
		expect(list.toArray().get()).toEqual([
			3,
			4,
			5,
			6,
			undefined,
			8,
			undefined,
			undefined,
		]);

		list.length.set(4);
		listener.assertCalledOnce();

		list.unshift(0, 1, 2);
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
