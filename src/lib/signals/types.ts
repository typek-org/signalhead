export type Subscriber<T> = (value: T, oldValue?: T) => void;
export type Unsubscriber = () => void;
export type Updater<T> = (value: T) => T;

export interface MinimalSignal<T> {
	subscribe(fn: Subscriber<T>): Unsubscriber;
	get?(): T | undefined;
}

export interface Signal<T> extends MinimalSignal<T> {
	get(): T | undefined;
	map<S>(fn: (value: T) => S): Signal<S>;
	enumerate(): Signal<[number, T]>;
}

export interface WriteonlySignal<T> {
	set(value: T): void;
}

export interface MinimalWritableSignal<T>
	extends MinimalSignal<T>,
		WriteonlySignal<T> {}

export interface WritableSignal<T>
	extends Signal<T>,
		Omit<MinimalWritableSignal<T>, "get"> {
	update(fn: Updater<T>): void;
	toReadonly(): Signal<T>;
	toWriteonly(): WriteonlySignal<T>;
}
