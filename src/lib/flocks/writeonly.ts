import { Unsubscriber } from "../mod";
import { FlockUpdate, FlockUpdateSubscriber } from "./readable";
import { MutFlockOptions } from "./writable";

export interface WriteonlyFlock<T> {
	add(value: T): void;
	delete(value: T): void;
	clear(): void;

	update(updates: FlockUpdate<T>[]): void;

	listenToUpdates(sub: FlockUpdateSubscriber<T>): Unsubscriber;
}

export const WriteonlyFlock = <T>({
	onStart,
	onStop,
}: MutFlockOptions = {}): WriteonlyFlock<T> => {
	const subs = new Set<FlockUpdateSubscriber<T>>();
	const deferred = new Set<Unsubscriber>();
	const defer = (d: Unsubscriber): void => void deferred.add(d);

	const listenToUpdates = (sub: FlockUpdateSubscriber<T>) => {
		if (subs.size === 0) onStart?.({ defer });

		subs.add(sub);
		return () => {
			subs.delete(sub);

			if (subs.size === 0) {
				for (const d of deferred) d();
				deferred.clear();
				onStop?.();
			}
		};
	};

	const update = (updates: FlockUpdate<T>[]) => {
		if (updates.length === 0) return;
		for (const s of subs) s(updates);
	};

	const add = (value: T) => update([{ type: "add", value }]);
	const delete_ = (value: T) => update([{ type: "delete", value }]);
	const clear = () => update([{ type: "clear" }]);

	return { add, delete: delete_, clear, update, listenToUpdates };
};
