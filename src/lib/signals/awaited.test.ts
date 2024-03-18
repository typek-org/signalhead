import { fn } from "../utils/testUtils";
import {
	AwaitedSignal,
	AwaitedSignalResult,
	CurrentlyFulfilledAwaitedSignal,
	LastFulfilledAwaitedSignal,
} from "./awaited";
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

			await p1.then(delay);
			f.assertCalledOnce([{ status: "fulfilled", value: 42 }]);

			const p2 = delay(200).then(() => 69);
			a.set(p2);
			f.assertCalledOnce([{ status: "pending", lastValue: 42 }]);

			await p2.then(delay);
			f.assertCalledOnce([{ status: "fulfilled", value: 69 }]);

			const p3 = delay(100).then(() => {
				throw new Error("fail");
			});
			a.set(p3);
			f.assertCalledOnce([{ status: "pending", lastValue: 69 }]);

			await p3.then(
				() => {},
				() => delay(),
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

		await p2.then(delay);
		f.assertCalledOnce([{ status: "fulfilled", value: -12 }]);

		await p1.then(delay);
		f.assertNotCalled();

		const p3 = delay(200).then(() => {
			throw new Error("fail");
		});
		a.set(p3);
		f.assertCalledOnce([{ status: "pending", lastValue: -12 }]);

		const p4 = delay(100).then(() => 3);
		a.set(p4);

		await p4.then(delay);
		f.assertCalledOnce([{ status: "fulfilled", value: 3 }]);

		await p3.then(
			() => {},
			() => delay(),
		);
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

		await p1.then(delay);
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

	describe("last fulfilled", () => {
		test("basic", async () => {
			for (const method of [true, false]) {
				const f = fn<void, [number | undefined]>();

				const p1 = delay(100).then(() => 42);
				const a = mut(p1);
				const b = method
					? a.awaited().lastFulfilled()
					: LastFulfilledAwaitedSignal(a);

				b.subscribe((x) => f(x));
				f.assertCalledOnce([undefined]);

				await p1.then(delay);
				f.assertCalledOnce([42]);

				const p2 = delay(200).then(() => 69);
				a.set(p2);
				f.assertNotCalled();
				expect(b.get()).toBe(42);

				await p2.then(delay);
				f.assertCalledOnce([69]);

				const p3 = delay(100).then(() => {
					throw new Error("fail");
				});
				a.set(p3);
				f.assertNotCalled();
				expect(b.get()).toBe(69);

				await p3.then(
					() => {},
					() => delay(),
				);

				f.assertNotCalled();
				expect(b.get()).toBe(69);
			}
		});
	});

	describe("currently fulfilled", () => {
		test("basic", async () => {
			for (const method of [true, false]) {
				const f = fn<void, [number | undefined]>();

				const p1 = delay(100).then(() => 42);
				const a = mut(p1);
				const b = method
					? a.awaited().currentlyFulfilled()
					: CurrentlyFulfilledAwaitedSignal(a);

				b.subscribe((x) => f(x));
				f.assertCalledOnce([undefined]);

				await p1.then(delay);
				f.assertCalledOnce([42]);

				const p2 = delay(200).then(() => 69);
				a.set(p2);
				f.assertCalledOnce([undefined]);

				await p2.then(delay);
				f.assertCalledOnce([69]);

				const p3 = delay(100).then(() => {
					throw new Error("fail");
				});
				a.set(p3);
				f.assertCalledOnce([undefined]);

				await p3.then(
					() => {},
					() => delay(),
				);

				f.assertNotCalled();
				expect(b.get()).toBe(undefined);
			}
		});
	});
});
