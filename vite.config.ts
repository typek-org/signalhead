import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/lib/mod.ts"),
			name: "@mod.js/signals",
			fileName: (format) =>
				`signals.${format === "umd" ? "umd.c" : ""}js`,
		},
	},
	plugins: [dts({ rollupTypes: true })],
});
