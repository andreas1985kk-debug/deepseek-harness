# Agent Note: German language pack for the web GUI

Status: implemented

English | [中文](2026-09-18-german-language-pack.zh.md)

## Problem

The web GUI shipped exactly two built-in locales, Chinese and English. A German-speaking user had no way to run the interface in German, and the locale service's language-pack seam — `addLanguage` plus the per-locale `register` form — had no shipping user, so its documented extension path was unverified at scale. The client copy lives in about forty feature packages, each owning a typed namespace whose key union is checked against the built-in `zh`/`en` pair, so the seam had to be exercised without touching that typed pair.

## Decision

**A dedicated `@deepseek-ai/dsh-client-locale-de` package ships the Deutsch locale and one dictionary per shipped client namespace.** It registers no slots and renders no UI: its browser half registers the language definition and the dictionaries as owned effects through `ctx.effect`. The package is wired into the `dsh-web-app` bundle like any other client plugin — a `dsh.client` row in `cordis.patch.yml`, a bundle dependency, and a `tsconfig.client.json` aggregate reference — so every deployment of the shipped web surface lists **Deutsch** alongside the built-in 中文 and English, and selecting it switches the whole interface immediately. A key this pack does not carry resolves through the locale service's fallback chain to English, so a namespace that grows new copy shows English for the missing keys instead of a raw key.

**The untyped single-locale `register` form is the seam this pack exists to prove.** A namespace's typed key union belongs to its owning feature package, and a language pack contributes one locale rather than completing the built-in pair, so the `Record<BuiltInLocaleId, …>` form does not apply. Keys are copied verbatim from each namespace's English source, including `{placeholder}` tokens; only the values are German.

**Product vocabulary stays verbatim, and format templates are localized.** Session, Workspace, Turn, Tool, Plugin, Skill, Subagent, Model, Provider, Prompt, and Cache are kept as loanwords because the product's own conventions treat them as tokens, and German developer UIs mix them natively. Paths, URLs, command tokens (`/plan`, `compact`), provider and application names, and numeric skeletons stay untranslated. Format templates that are locale-sensitive are localized: `number.groupSeparator` is `.`, `clock.md` is `{m}.{d}`.

**One dictionary file per namespace, aggregated by an index.** `src/client/locales/index.ts` maps each namespace id to its German dictionary (`DE`) and exports the locale id and self-described label.

## Verification

The package spec (8 tests) stands up the locale service with `LocaleRuntime` directly, asserts Deutsch appears in the catalog and is selectable, translates one key of every shipped namespace through German, asserts English still answers a key no German dictionary carries, asserts every value is a non-empty string with no duplicate keys and well-formed `{placeholder}` tokens, and asserts the language and all dictionaries leave with the fiber. The node half stays inert. Key parity was audited programmatically against every namespace's `zh` source: exact key sets with zero missing and zero extra keys across all 45 namespaces, including the two the first draft missed (`settings.permission` and the `directory-browser` dialog) and the corrected `permission.access` key set. `pnpm run test:gui`, `pnpm --filter @deepseek-ai/dsh-client-locale-de bundle`, and the generated-catalog regenerations (`gen-module-graph`, `gen-config-catalog`, `gen-client-catalog`, `gen-dependency-catalog`) own the remaining pre-push evidence.

## Alternatives considered

**Promote `de` to a third built-in locale by widening `BuiltInLocaleId`.** Rejected: every client package's typed `register(ns, { zh, en, de })` call would fail to compile until all of them grew a German dictionary, so one language's completeness would become a blocking dependency across forty packages. The built-in pair exists to enforce bilingual balance for the pair the repo authors. The language-pack seam exists for exactly this.

**Translate inside each feature package.** Rejected: German would spread across forty packages with no shared vocabulary, and the client-plugin purity rules forbid cross-package value imports, so no package could reuse another's German copy. A single pack keeps one owner for the language and one place for the audit.

**Generate dictionaries from the English sources at build time.** Rejected: the output of a machine translation is not reviewable in a diff and would bind a translation provider to the build. The parity audit against the English sources is the mechanical part; the values stay human-authored.

## Consequences

- A feature package that adds an English key ships without a German counterpart, and the lookup chain renders English for that key. Key parity is a maintenance audit, not a compile error; the package README records this as a known limitation.
- The shipped web client bundle grows by the German payload, about 1330 strings, in exchange for a fully German interface.
- The pack is the reference implementation of a shipped language pack: a following language copies the layout, the wiring, and the parity audit, and the locale service's extension point is now exercised at shipping scale.

## Consequences (Chinese counterpart section omitted per format)

The consequences above are the present-tense shipped reality; the Chinese counterpart mirrors the English structure section-for-section with the header tokens `# Agent Note: ` and `Status: implemented` in English verbatim.
