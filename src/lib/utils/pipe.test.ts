import { pipableOf, pipe } from "./pipe.ts";
import { expectType, expectTypes } from "./testUtils.ts";

describe("pipe", () => {
	test("function", () => {
		const fourtyFour = pipe(42, (x) => x + 2);
		expect(fourtyFour).toBe(44);
		expectTypes<typeof fourtyFour, number>().toBeEqual();

		const bigGuy = pipe(
			"joe",
			(x) => x.toUpperCase(),
			(x) => `Hey, ${x}!`,
			(x) => ({ value: x, repeat: 3 }),
			({ value, repeat }) =>
				Array.from<typeof value>({ length: repeat }).fill(value),
			(x) => {
				expectType<typeof x>().toBe<string[]>();
				return x.join(" ");
			},
		);
		expect(bigGuy).toBe("Hey, JOE! Hey, JOE! Hey, JOE!");
		expectTypes<typeof bigGuy, string>().toBeEqual();
	});

	test("method", () => {
		const a = [1, 2, 3, 4, 5];
		const map =
			<S, T>(fn: (v: S) => T): ((a: S[]) => T[]) =>
			(arr) =>
				arr.map(fn);

		const b = pipableOf(a).pipe(
			(x) => [0, ...x],
			map((x) => 2 * x),
			map((x) => x.toString()),
			([x, y, z]) => [z, y, x] as const,
		);
		expect(b).toStrictEqual(["4", "2", "0"]);
		expectType<typeof b>().toBe<readonly [string, string, string]>();
	});
});
