import { MutPack, mut } from "../mod.ts";
import { fn } from "../utils/testUtils.ts";
import { ForEachParams, Pack } from "./readable.ts";

describe("Pack", () => {
	test("basic derived pack", () => {
		const n = mut(3);
		const str = mut("world");
		const pack = Pack<number | string>(1, 2, n, "hello", str);

		expect(pack.toArray().get()).toEqual([1, 2, 3, "hello", "world"]);

		n.set(4);
		str.set("joe");
		expect(pack.toArray().get()).toEqual([1, 2, 4, "hello", "joe"]);
	});

	test("forEach", () => {
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
});
