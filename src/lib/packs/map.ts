import { Unsubscriber } from "../mod.ts";
import {
	Pack,
	PackUpdate,
	PackUpdateSubscriber,
	MinimalPack,
} from "./readable.ts";

export const MappedPack = <T, U>(
	pack: MinimalPack<T>,
	fn: (value: T | undefined) => U | undefined,
): Pack<U> => {
	const { length } = pack;

	const getAt = (index: number) => fn(pack.getAt(index));

	const listenToUpdates = (
		sub: PackUpdateSubscriber<U>,
	): Unsubscriber => {
		return pack.listenToUpdates((updates) =>
			sub(
				updates.map((update: PackUpdate<T>): PackUpdate<U> => {
					switch (update.type) {
						case "insert":
							return {
								type: "insert",
								index: update.index,
								value: fn(update.value),
							};
						case "modify":
							return {
								type: "modify",
								index: update.index,
								value: fn(update.value)!,
							};
						case "delete":
						case "move":
							return update;
					}
				}),
			),
		);
	};

	return Pack.fromMinimal({
		length,
		getAt,
		listenToUpdates,
	});
};
