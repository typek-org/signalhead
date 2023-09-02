export type Component<Props, Context> = (
	props: Props,
) => Mountable<Context>;

export interface Mountable<Context> {
	mount(context: Context): () => void;
}
