import { expect } from "@std/expect";
import { MutPack, mut } from "../mod.ts";
import { fn } from "../utils/testUtils.ts";
import { type ForEachParams, Pack } from "./readable.ts";

Deno.test("Pack", () => {
	Deno.test("basic derived pack", () => {
		const n = mut(3);
		const str = mut("world");
		const pack = Pack<number | string>(1, 2, n, "hello", str);

		expect(Pack.isPack(n)).toEqual(false);
		expect(Pack.isPack(pack)).toEqual(true);

		expect(pack.toArray().get()).toEqual([1, 2, 3, "hello", "world"]);

		n.set(4);
		str.set("joe");
		expect(pack.toArray().get()).toEqual([1, 2, 4, "hello", "joe"]);
	});

	Deno.test("forEach", () => {
		const pack = MutPack([..."🍎🍌🍉"]);
		const map = new Map<string, ForEachParams<string>>();
		const f = fn((p: ForEachParams<string>) => {
			const key = p.value.get()!;
			map.set(key, p);
			p.defer(() => map.delete(key));
		});

		const u = pack.forEach(f);
		f.assertCalledTimes(3);

		expect(map.size).toBe(3);
		expect(map.get("🍎")!.value.get()).toBe("🍎");
		expect(map.get("🍎")!.index.get()).toBe(0);
		expect(map.get("🍌")!.value.get()).toBe("🍌");
		expect(map.get("🍌")!.index.get()).toBe(1);
		expect(map.get("🍉")!.value.get()).toBe("🍉");
		expect(map.get("🍉")!.index.get()).toBe(2);

		pack.deleteAt(1);
		expect(map.has("🍌")).toBe(false);
		expect(map.get("🍉")!.index.get()).toBe(1);

		pack.setAt(0, "🍏");
		expect(map.get("🍎")!.value.get()).toBe("🍏");
		expect(map.get("🍎")!.index.get()).toBe(0);
		expect(map.get("🍉")!.value.get()).toBe("🍉");
		expect(map.get("🍉")!.index.get()).toBe(1);

		pack.insertAt(1, "🍍");
		f.assertCalledOnce();
		expect(map.get("🍍")!.value.get()).toBe("🍍");
		expect(map.get("🍍")!.index.get()).toBe(1);
		expect(map.get("🍉")!.index.get()).toBe(2);

		pack.swap(0, 2);
		expect(map.get("🍉")!.value.get()).toBe("🍉");
		expect(map.get("🍉")!.index.get()).toBe(0);
		expect(map.get("🍍")!.value.get()).toBe("🍍");
		expect(map.get("🍍")!.index.get()).toBe(1);
		expect(map.get("🍎")!.value.get()).toBe("🍏");
		expect(map.get("🍎")!.index.get()).toBe(2);

		u();
		expect(map.size).toBe(0);
	});

	Deno.test("reduceSimple", () => {
		const pack = MutPack([0, 1, 2, 3, 4]);
		const sum = pack.reduce((acc, value) => acc + (value ?? 0), 0);

		expect(sum.get()).toBe(10);

		pack.setAt(0, 5);
		expect(sum.get()).toBe(15);

		pack.insertAt(1, 5);
		expect(sum.get()).toBe(20);

		pack.deleteAt(2);
		expect(sum.get()).toBe(18);

		pack.swap(0, 3);
		expect(sum.get()).toBe(18);
	});
	Deno.test("reduceWithInverse", () => {
		const pack = MutPack([0, 1, 2, 3, 4]);
		const sum = pack.reduce(
			(acc, value) => acc + (value ?? 0),
			0,
			(acc, value) => acc - (value ?? 0),
		);

		expect(sum.get()).toBe(10);

		pack.setAt(0, 5);
		expect(sum.get()).toBe(15);

		pack.insertAt(1, 5);
		expect(sum.get()).toBe(20);

		pack.deleteAt(2);
		expect(sum.get()).toBe(18);

		pack.swap(0, 3);
		expect(sum.get()).toBe(18);
	});
});
