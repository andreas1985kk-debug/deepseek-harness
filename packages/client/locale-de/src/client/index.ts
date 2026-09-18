/**
 * German language pack, browser half. Registers the Deutsch locale and one
 * dictionary per shipped client namespace. Keys mirror each namespace's
 * English source; a key this pack misses resolves through the locale
 * service's fallback chain, so missing copy shows English rather than a raw
 * key.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: the ctx.locale Context merge (the runtime is a service, not a value import).
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { DE, LOCALE_ID, LOCALE_LABEL } from './locales/index.ts'

/** Required services: the locale registry this pack extends. */
export const inject = ['locale']

/**
 * Register the language definition and every namespace dictionary as owned
 * effects. Disposing the fiber removes the language from the selector and
 * every dictionary from the registry, returning an active selection to the
 * browser-derived or default locale.
 * @param ctx - client cordis context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(
    () => ctx.locale.addLanguage({ id: LOCALE_ID, label: LOCALE_LABEL, fallback: 'en' }),
    'locale-de: language',
  )
  ctx.effect(() => {
    const disposers = Object.entries(DE).map(
      ([ns, dict]) => ctx.locale.register(ns, LOCALE_ID, dict),
    )
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'locale-de: dictionaries')
}
