export function range(length: number): Iterable<number>;
export function range(
	start: number,
	endExclusive: number,
	step?: number,
): Iterable<number>;
export function* range(a: number, b?: number, step: number = 1) {
	const [start, end] = b === undefined ? [0, a] : [a, b];

	for (let i = start; i < end; i += step) {
		yield i;
	}
}

export class MapSet<K, V> implements Map<K, Set<V>> {
	#data = new Map<K, Set<V>>();

	[Symbol.toStringTag] = "MapSet";

	get size(): number {
		let s = 0;
		for (const set of this.#data.values()) s += set.size;
		return s;
	}

	keys() {
		return this.#data.keys();
	}

	values() {
		return this.#data.values();
	}

	entries() {
		return this.#data.entries();
	}

	[Symbol.iterator]() {
		return this.entries();
	}

	*flatValues(): IterableIterator<V> {
		for (const values of this.values()) yield* values;
	}

	forEach(
		fn: (value: Set<V>, key: K, map: Map<K, Set<V>>) => void,
		thisArg?: any,
	): void {
		return this.#data.forEach(fn, thisArg);
	}

	clear() {
		this.#data.clear();
	}

	delete(key: K, value?: V): boolean {
		if (arguments.length === 2) {
			const set = this.#data.get(key);
			if (!set) return false;
			return set.delete(value!);
		} else {
			return this.#data.delete(key);
		}
	}

	get(key: K): Set<V> | undefined {
		return this.#data.get(key);
	}

	has(key: K, value?: V): boolean {
		if (arguments.length === 2) {
			return this.#data.get(key)?.has(value!) ?? false;
		} else {
			return this.#data.has(key);
		}
	}

	set(key: K, values: Set<V>): this {
		this.#data.set(key, values);
		return this;
	}

	add(key: K, value: V): this {
		let set = this.#data.get(key);
		if (!set) {
			set = new Set();
			this.#data.set(key, set);
		}
		set.add(value);
		return this;
	}
}
