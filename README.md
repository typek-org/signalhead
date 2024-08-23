# Signalhead
_**Battle-tested reactivity primitives.**_

Signalhead is a lightweight, framework-agnostic toolkit for managing reactive state in interactive apps. Whether you're mapping, filtering, or zipping signals together, Signalhead keeps your code clean and reactive state management fun and glitchless. It also works great with arrays, sets and promises.

```ts
import { mut } from "@typek/signalhead";

const count = mut(1);
const double = count.map(n => 2 * n);

const user = mut(fetchUserData());
const name = user.await().map(
  (p) => p.status === "fullfilled" ? p.value.name : "Loading..."
);

name.subscribe(n => console.log(n));
// Loading...
// Joe
```

### Quick Links
**Docs**: [`Signal`](https://jsr.io/@typek/signalhead/doc/~/Signal), [`WritableSignal`](https://jsr.io/@typek/signalhead/doc/~/WritableSignal), [`AwaitedSignal`](https://jsr.io/@typek/signalhead/doc/~/AwaitedSignal), [`derived`](https://jsr.io/@typek/signalhead/doc/~/derived), [`mutDerived`](https://jsr.io/@typek/signalhead/doc/~/mutDerived), [`effect`](https://jsr.io/@typek/signalhead/doc/~/effect), [`Flock`](https://jsr.io/@typek/signalhead/doc/~/Flock), [`MutFlock`](https://jsr.io/@typek/signalhead/doc/~/MutFlock), [`Pack`](https://jsr.io/@typek/signalhead/doc/~/Pack), [`MutPack`](https://jsr.io/@typek/signalhead/doc/~/MutPack)

**Git**: [_Repo_](https://github.com/m93a/signalhead), [_Issues_](https://github.com/m93a/signalhead/issues), [_Discussions_](https://github.com/m93a/signalhead/discussions)
