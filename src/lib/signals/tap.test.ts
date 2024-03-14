import { fn } from "../utils/testUtils.ts";
import { TappedSignal } from "./tap.ts";
import { mut } from "./writable.ts";

describe("tap", () => {
	test("basic get & subscribe", () => {
		for (const method of [true, false]) {
			const a = mut("hello");

			const f = fn<void, [string]>();
			const b = method ? a.tap(f) : TappedSignal(a, f);

			f.assertNotCalled();

			const g = fn<void, [string]>();
			const u = b.subscribe((x) => g(x));
			f.assertCalledOnce(["hello"]);
			g.assertCalledOnce(["hello"]);

			a.set("world");
			f.assertCalledOnce(["world"]);
			g.assertCalledOnce(["world"]);

			u();
			a.set("sike");
			f.assertNotCalled();
			g.assertNotCalled();
		}
	});
});
