import { expectType } from "../utils/testUtils.ts";
import { Signal } from "./readable.ts";
import { WritableSignal } from "./writable.ts";

describe("writable", () => {
	test("types", <T>() => {
		expectType<WritableSignal<T>>().toExtend<Signal<T>>();
	});
});
