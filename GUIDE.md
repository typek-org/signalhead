# Guide

## Introduction

### What Is a Signal
If you've ever worked with a spreadsheet program, you already have an intuitive understanding of what signals are. Imagine you open Excel, put the number “5” into cell _A1_ and “3” into cell _B1_. Now you click on another cell and enter the formula “=A1+B1”; the cell will now proudly display the number 8. However, if you come back to _A1_ and change its value to say “−1”, the other cell will automatically update to display 2.

Signals are like these spreadsheet cells, but for a programming language. In Signalhead, you create a mutable signal using the `mut` function:
```ts
import { mut } from "@typek/signalhead";
const a = mut(5);
const b = mut(3);
```
There are several ways to create a computed signal – the equivalent of a _spreadsheet formula_. Probably the most straightforward one is via the `derived` function:
```ts
import { derived } from "@typek/signalhead";
const c = derived($ => $(a) + $(b));

c.get() // returns 8
```
If we now change the value of `a`, the value of `c` will update correspondingly:
```ts
a.set(-1);
c.get() // returns 2
```

### Why Is a Signal?!
Sure, these signals are cool, but what are they good for? It may not be immediately obvious how you'd use them in your application. Unless you're making Excel, of course. They come from a paradigm called _reactive programming_, developed throughout the [90s](https://dl.acm.org/doi/pdf/10.1145/258949.258973) and [2000s](https://docs.racket-lang.org/frtime/), and popularized by frontend JavaScript frameworks in the [2020s](https://svelte.dev/blog/runes#signal-boost).

The main idea is this: any interactive application fundamentaly consists of maintaining some kind of inner state, listening to events from the outside world and modifying the state accordingly, and then using the state to perform actions. Reactive programming provides suitable primitives for all of these. While with imperative programming, you have to code every single things that happens by hand, reactive programming lets you simply describe how the parts are related, and then manages the propagation of data for you.

This leads to code that is much more manageable and less error prone than imperative code.

### Thinking Reactively
Reactive programming is a distinct programming paradigm, and as such it requires some patience to learn properly. Especially if you've never worked with signals before, you might find yourself trying to apply old coding patterns that feel awkward or outright broken with this library. Do not despair! It's not a sign of your weakness as a programmer (nor a problem with the library), but rather a necessary consequence of learning something new. This guide will try its best to help you understand the strengths of reactive state management, and teach you how to make production-ready apps with it.

### Dataflow
The crux of designing a reactive app (or refactoring an old app to be reactive) is identifying how data flows in it. Any interactive program will have some state, usually represented by a bunch of variables, that can change in response to various circumstances: user interaction, new data becoming available, timed events, or even in reaction to the change of _some other_ state variables.

Our first job will be to decide what the _sources of truth_ are. A source of truth is a variable that doesn't (semantically) depend on the value of any other variable. Sources of truth are changed by direct interaction with the outside world, rather than by some other internal part of your app.

**Example**: Imagine an app, where the user fills in their first name (eg. “John”) and their surname (eg. “Doe”) and the app displays a greeting (“Hello, John Doe!”) and informs them how many people with the same name there are (“5 million”). Both the name and the surname are _sources of truth_, as they only depend on what the user enters. The greeting clearly only depends on other state variables, so its not a source of truth, but rather a derived state. The number of namesakes depends on some input from the outside world, but it is ultimately determined by _first name_ and _surname_, so we will also consider it as a derived state.

In Signalhead, we represent sources of truth by _mutable signals_ and derived state by _computed signals_! Here's how you'd implement the example:

```ts
import { mut, derived } from "@typek/signalhead";

const firstName = mut("John");
const surname = mut("Doe");

const greeting = derived($ =>
  `Hello, ${$(firstName)} ${$(surname)})!`
);

const namesakes = derived(async $ => {
  const res = await fetch(
    `namesake.com/api/${$(firstName)}/${$(surname)}`
  );
  return res.text();
}).awaited();
```
Don't worry about the precise syntax – we'll get to it soon!

### Single Source of Truth
Sometimes there might be two variables which represent essentially the same piece of information, and both are set by external triggers.

**Example:** Imagine a _UTC Time Converter_ app, which has two inputs – one represents a time & date in the user's local time zone, and the other represents a time & date in UTC. If the user changes either of those, the other one automatically updates to the corresponding value.

In such cases, you might be tempted to implement both of these as _mutable signals_.
