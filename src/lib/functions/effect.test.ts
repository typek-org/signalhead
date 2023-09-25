import { effect, mut } from "../mod.ts";

describe("effect", () => {
	test("basic", () => {
		const showName = mut(false);
		const greeting = mut("Hello");
		const name = mut("world");

		const sendMessage = jest.fn<void, [string]>();

		const u = effect(($) => {
			let m = $(greeting);

			if ($(showName)) {
				m += ", " + $(name);
			}

			m += "!";
			sendMessage(m);
		});

		expect(sendMessage).toBeCalledTimes(1);
		expect(sendMessage).lastCalledWith("Hello!");

		showName.set(true);
		expect(sendMessage).toBeCalledTimes(2);
		expect(sendMessage).lastCalledWith("Hello, world!");

		name.set("Gordon");
		expect(sendMessage).toBeCalledTimes(3);
		expect(sendMessage).lastCalledWith("Hello, Gordon!");

		greeting.set("Greetings");
		expect(sendMessage).toBeCalledTimes(4);
		expect(sendMessage).lastCalledWith("Greetings, Gordon!");

		showName.set(false);
		expect(sendMessage).toBeCalledTimes(5);
		expect(sendMessage).lastCalledWith("Greetings!");

		name.set("Freeman");
		expect(sendMessage).toBeCalledTimes(5);

		greeting.set("Bye");
		expect(sendMessage).toBeCalledTimes(6);
		expect(sendMessage).lastCalledWith("Bye!");

		u();
		greeting.set("Are you still here");
		name.set("John?");
		showName.set(true);
		expect(sendMessage).toBeCalledTimes(6);
	});
});
