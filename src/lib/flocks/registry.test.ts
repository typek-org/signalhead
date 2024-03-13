import { mut } from "../mod.ts";
import { FlockRegistry } from "./mod.ts";

describe("flock", () => {
	test("basic", () => {
		const s = FlockRegistry<string>();

		const f = jest.fn<void, [Set<string>]>();
		const u = s.toSet().subscribe((x) => f(x));
		expect(f).toBeCalledTimes(1);
		expect(f).lastCalledWith(new Set([]));

		const name = mut("joe");
		const uname = s.register(name);
		expect(f).toBeCalledTimes(2);
		expect(f).lastCalledWith(new Set(["joe"]));

		const greeting = mut("hey");
		s.register(greeting);
		expect(f).toBeCalledTimes(3);
		expect(f).lastCalledWith(new Set(["hey", "joe"]));

		const name2 = mut("joe");
		s.register(name2);
		expect(f).toBeCalledTimes(3);

		name2.set("jude");
		expect(f).toBeCalledTimes(4);
		expect(f).lastCalledWith(new Set(["hey", "joe", "jude"]));

		uname();
		expect(f).toBeCalledTimes(5);
		expect(f).lastCalledWith(new Set(["hey", "jude"]));

		greeting.set("bye");
		expect(f).toBeCalledTimes(6);
		expect(f).lastCalledWith(new Set(["bye", "jude"]));

		u();
		greeting.set("what's up");
		expect(f).toBeCalledTimes(6);
	});
});
