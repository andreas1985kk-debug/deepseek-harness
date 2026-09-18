---
description: "German language pack for the web GUI: the Deutsch locale plus one dictionary per shipped client namespace, for users who want the interface in German."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-locale-de

English | [中文](README.zh.md)

## Summary

Use `dsh-client-locale-de` to run the web GUI in German. The pack registers the `de` locale and one German dictionary for every client namespace the shipped web roster renders; the Settings → General language row then lists **Deutsch** alongside the built-in 中文 and English, and selecting it switches the whole interface immediately. A key this pack does not carry resolves through the locale service's fallback chain to English, so a namespace that grows new copy shows English for the missing keys instead of a raw key.

## Use this package

Nothing needs configuring. The package activates with the client tree of the `dsh-web-app` bundle, and its browser half registers the language definition and the dictionaries as owned effects. Open Settings → General and pick **Deutsch**; the choice persists in `$DSH_HOME/settings.yaml` like any other locale preference, and `<html lang>` points at `de`.

Removing the `locale-de` row from the bundle patch (or unloading the plugin) removes the language from the selector and returns an active German selection to the browser-derived or default locale.

## Understand the implementation

The pack owns no UI: it registers no slots and renders nothing. It is a dictionary contributor over the `locale` service:

- `src/client/locales/index.ts` maps each namespace id to its German dictionary (`DE`) and exports the locale id and self-described label.
- `src/client/locales/<namespace>.ts` holds one namespace's dictionary. Keys are copied verbatim from each namespace's English source, including `{placeholder}` tokens; only the values are German.
- `src/client/index.ts` calls `ctx.locale.addLanguage({ id, label, fallback: 'en' })` and `ctx.locale.register(ns, 'de', dict)` per namespace inside `ctx.effect`, so disposal unregisters both.

The untyped single-locale `register` form is deliberate: the namespace key unions live in the feature packages that own them, and a language pack contributes one locale rather than completing the built-in pair, so the typed `Record<BuiltInLocaleId, …>` form does not apply.

## Model Experience

None, as a language pack registers nothing model-facing; it only contributes browser-side copy.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

These limits define where the German translation is incomplete or drifts by construction. They are current package constraints, not a task backlog.

- **Key completeness is not compile-checked.** A namespace's typed key union belongs to its owning feature package, so nothing fails a build when that package adds an English key without a German counterpart. The lookup chain renders English for the missing key. A key-parity audit against the English sources is the maintenance step when feature packages ship new copy.
- **Registry-held text reads its translation once.** Copy captured at registration time outside the slot render path (command descriptions, for example) keeps the language it was registered under until re-registration; this is the locale service's documented constraint, inherited by every language pack.
- **No plural rules or bidirectional layout.** The locale registry supplies selection, persistence, and key fallback only; German plurals are expressed with the `one`/`other` key pairs each namespace already defines, and German needs no RTL handling.

**Runtime invariant:** No companion is published. The dictionaries have no independent runtime source to compare against; registration, lookup, and disposal are asserted by the behavior spec.
