import { expectType } from "../utils/testUtils.ts";
import type { Signal } from "./readable.ts";
import type { WritableSignal } from "./writable.ts";

Deno.test("writable", () => {
	Deno.test("types", <T>() => {
		expectType<WritableSignal<T>>().toExtend<Signal<T>>();
	});
});
