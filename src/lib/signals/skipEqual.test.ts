import { fn } from "../utils/testUtils.ts";
import { mut } from "./writable.ts";

describe("skipEqual", () => {
	test("basic", () => {
		const a = mut(4);
		const b = a.skipEqual();
		const f = fn<void, [number]>();

		b.subscribe((x) => f(x));
		f.assertCalledOnce([4]);

		a.set(5);
		f.assertCalledOnce([5]);

		a.set(5);
		f.assertNotCalled();
	});

	test("validation & invalidation", () => {
		const a = mut(4);
		const b = a.skipEqual();

		const f = fn<void, [number]>();
		const g = fn<void, []>();
		const h = fn<void, []>();

		{
			b.subscribe((x) => f(x), g, h);
			f.assertCalledOnce();
			g.assertNotCalled();
			h.assertNotCalled();

			a.set(5);
			f.assertCalledOnce();
			g.assertCalledOnce();
			h.assertNotCalled();

			a.set(5);
			f.assertNotCalled();
			g.assertCalledOnce();
			h.assertCalledOnce();
		}

		{
			a.invalidate();
			f.assertNotCalled();
			g.assertCalledOnce();
			h.assertNotCalled();

			a.validate();
			f.assertNotCalled();
			g.assertNotCalled();
			h.assertCalledOnce();
		}

		{
			a.invalidate();
			f.assertNotCalled();
			g.assertCalledOnce();
			h.assertNotCalled();

			a.set(4);
			f.assertCalledOnce([4]);
			g.assertNotCalled();
			h.assertNotCalled();
		}

		{
			a.invalidate();
			f.assertNotCalled();
			g.assertCalledOnce();
			h.assertNotCalled();

			a.set(4);
			f.assertNotCalled();
			g.assertNotCalled();
			h.assertCalledOnce();
		}
	});
});
