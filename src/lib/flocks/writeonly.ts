import { Unsubscriber } from "../mod";
import { FlockUpdate, FlockUpdateSubscriber } from "./readable";
import { MutFlockOptions } from "./writable";

export interface WriteonlyFlock<T> {
	add(value: T): void;
	delete(value: T): void;
	clear(): void;

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

	const add = (value: T) => {
		const updates: FlockUpdate<T>[] = [{ type: "add", value }];
		for (const s of subs) s(updates);
	};

	const delete_ = (value: T) => {
		const updates: FlockUpdate<T>[] = [{ type: "delete", value }];
		for (const s of subs) s(updates);
	};

	const clear = () => {
		const updates: FlockUpdate<T>[] = [{ type: "clear" }];
		for (const s of subs) s(updates);
	};

	return { add, delete: delete_, clear, listenToUpdates };
};
