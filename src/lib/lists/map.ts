import { Unsubscriber } from "../mod.ts";
import {
	List,
	ListUpdate,
	ListUpdateSubscriber,
	MinimalList,
} from "./readable.ts";

export const MappedList = <T, U>(
	list: MinimalList<T>,
	fn: (value: T | undefined) => U | undefined,
): List<U> => {
	const { length } = list;

	const getAt = (index: number) => fn(list.getAt(index));

	const listenToUpdates = (
		sub: ListUpdateSubscriber<U>,
	): Unsubscriber => {
		return list.listenToUpdates((updates) =>
			sub(
				updates.map((update: ListUpdate<T>): ListUpdate<U> => {
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

	return List.fromMinimal({
		length,
		getAt,
		listenToUpdates,
	});
};
