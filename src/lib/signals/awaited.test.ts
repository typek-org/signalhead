import { fn } from "../utils/testUtils";
import { AwaitedSignal, AwaitedSignalResult } from "./awaited";
import { mut } from "./writable";

const delay = (ms: number = 0) =>
	new Promise<void>((res) => setTimeout(res, ms));

describe("awaited", () => {
	test("basic", async () => {
		for (const method of [true, false]) {
			const f = fn<void, [undefined | AwaitedSignalResult<number>]>();

			const p1 = delay(100).then(() => 42);
			const a = mut(p1);
			const b = method ? a.awaited() : AwaitedSignal(a);

			b.subscribe((x) => f(x));
			f.assertCalledOnce([
				{ status: "pending", lastValue: undefined },
			]);

			await p1.then(() => delay());
			f.assertCalledOnce([{ status: "fulfilled", value: 42 }]);

			const p2 = delay(200).then(() => 69);
			a.set(p2);
			f.assertCalledOnce([{ status: "pending", lastValue: 42 }]);

			await p2.then(() => delay());
			f.assertCalledOnce([{ status: "fulfilled", value: 69 }]);

			const p3 = delay(100).then(
				() => new Promise<number>((_, rej) => rej(new Error("fail"))),
			);
			a.set(p3);
			f.assertCalledOnce([{ status: "pending", lastValue: 69 }]);

			await p3.then(
				() => {},
				() => delay(0),
			);

			f.assertCalledOnce([
				{
					status: "rejected",
					lastValue: 69,
					reason: new Error("fail"),
				},
			]);
		}
	});

	test("race conditions", async () => {
		const f = fn<void, [undefined | AwaitedSignalResult<number>]>();

		const p1 = delay(200).then(() => 420);
		const a = mut(p1);
		const b = a.awaited();

		b.subscribe((x) => f(x));
		f.assertCalledOnce([{ status: "pending", lastValue: undefined }]);

		const p2 = delay(100).then(() => -12);
		a.set(p2);
		f.assertNotCalled();

		await p2.then(() => delay());
		f.assertCalledOnce([{ status: "fulfilled", value: -12 }]);

		await p1.then(() => delay());
		f.assertNotCalled();
	});

	test("invalidation", async () => {
		const p1 = delay(100).then(() => 1);
		const a = mut(p1);
		const b = a.awaited();

		let isValid = true;
		const f = fn<void, [undefined | AwaitedSignalResult<number>]>(
			() => (isValid = true),
		);
		const h = fn<void, []>(() => (isValid = false));
		b.subscribe(
			(x) => f(x),
			() => h(),
			() => (isValid = true),
		);
		h.assertNotCalled();
		f.assertCalledOnce([{ status: "pending", lastValue: undefined }]);

		await p1.then(() => delay());
		h.assertCalledOnce();
		f.assertCalledOnce();
		expect(isValid).toBe(true);

		a.invalidate();
		h.assertCalledOnce();
		expect(isValid).toBe(false);

		a.validate();
		expect(isValid).toBe(true);
		f.assertNotCalled();
	});
});
