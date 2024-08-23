import { effect, mut } from "../mod.ts";
import { fn } from "../utils/testUtils.ts";

Deno.test("effect", () => {
	Deno.test("basic", () => {
		const showName = mut(false);
		const greeting = mut("Hello");
		const name = mut("world");

		const sendMessage = fn<void, [string]>();

		const u = effect(($) => {
			let m = $(greeting);

			if ($(showName)) {
				m += ", " + $(name);
			}

			m += "!";
			sendMessage(m);
		});

		sendMessage.assertCalledOnce(["Hello!"]);

		showName.set(true);
		sendMessage.assertCalledOnce(["Hello, world!"]);

		name.set("Gordon");
		sendMessage.assertCalledOnce(["Hello, Gordon!"]);

		greeting.set("Greetings");
		sendMessage.assertCalledOnce(["Greetings, Gordon!"]);

		showName.set(false);
		sendMessage.assertCalledOnce(["Greetings!"]);

		name.set("Freeman");
		sendMessage.assertNotCalled();

		greeting.set("Bye");
		sendMessage.assertCalledOnce(["Bye!"]);

		u();
		greeting.set("Are you still here");
		name.set("John?");
		showName.set(true);
		sendMessage.assertNotCalled();
	});
});
