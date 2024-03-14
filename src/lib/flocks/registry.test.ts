import { mut } from "../mod.ts";
import { fn } from "../utils/testUtils.ts";
import { FlockRegistry } from "./mod.ts";

describe("flock", () => {
	test("basic", () => {
		const s = FlockRegistry<string>();

		const f = fn<void, [Set<string>]>();
		const u = s.toSet().subscribe((x) => f(x));
		f.assertCalledOnce([new Set([])]);

		const name = mut("joe");
		const uname = s.register(name);
		f.assertCalledOnce([new Set(["joe"])]);

		const greeting = mut("hey");
		s.register(greeting);
		f.assertCalledOnce([new Set(["hey", "joe"])]);

		const name2 = mut("joe");
		s.register(name2);
		f.assertNotCalled();

		name2.set("jude");
		f.assertCalledOnce([new Set(["hey", "joe", "jude"])]);

		uname();
		f.assertCalledOnce([new Set(["hey", "jude"])]);

		greeting.set("bye");
		f.assertCalledOnce([new Set(["bye", "jude"])]);

		u();
		greeting.set("what's up");
		f.assertNotCalled();
	});
});
