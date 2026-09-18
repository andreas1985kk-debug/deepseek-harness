// @vitest-environment jsdom
import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import { FALLBACK_LOCALE, LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { apply, inject } from '../src/client/index.ts'
import { apply as applyNode } from '../src/index.ts'
import { DE, LOCALE_ID, LOCALE_LABEL } from '../src/client/locales/index.ts'

/**
 * The locale service standing alone: the shipped catalog plus the common and
 * settings.locale dictionaries, with no Host scope (selections stay
 * process-local, which is all these specs exercise).
 */
async function baseContext(): Promise<Context> {
  const ctx = new Context()
  const locale = new LocaleRuntime(ctx)
  ctx.provide('locale', locale)
  return ctx
}

describe('locale-de browser half', () => {
  it('declares only the locale service', () => {
    expect(inject).toEqual(['locale'])
  })

  it('adds Deutsch to the catalog and makes it selectable', async () => {
    const ctx = await baseContext()
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    expect(ctx.locale.getLocale().locales).toContainEqual({
      id: LOCALE_ID,
      label: LOCALE_LABEL,
      fallback: FALLBACK_LOCALE,
    })

    ctx.locale.setLocale(LOCALE_ID)
    expect(ctx.locale.getLocale().active).toBe(LOCALE_ID)

    await fiber.dispose()
    await ctx.fiber.dispose()
  })

  it('ships a non-empty German value for every key of every namespace', () => {
    const namespaces = Object.keys(DE)
    expect(namespaces.length).toBeGreaterThan(30)
    for (const ns of namespaces) {
      const dict = DE[ns]!
      const keys = Object.keys(dict)
      expect(keys.length, ns + ' has no keys').toBeGreaterThan(0)
      expect(new Set(keys).size, ns + ' has duplicate keys').toBe(keys.length)
      for (const key of keys) {
        const value = dict[key]!
        expect(typeof value, ns + '.' + key + ' is not a string').toBe('string')
        expect(value.length, ns + '.' + key + ' is empty').toBeGreaterThan(0)
      }
    }
  })

  it('keeps every {placeholder} token well-formed', () => {
    // Interpolation looks up \w+ names, so a stray brace pair in a German
    // value would survive as literal text instead of a parameter.
    const WELL_FORMED = /^([^{}]*|\{\w+\})*$/
    for (const ns of Object.keys(DE)) {
      for (const [key, value] of Object.entries(DE[ns]!)) {
        expect(WELL_FORMED.test(value), ns + '.' + key + ' has a malformed placeholder').toBe(true)
      }
    }
  })

  it('translates one key of every shipped namespace through German', async () => {
    const ctx = await baseContext()
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    ctx.locale.setLocale(LOCALE_ID)
    for (const ns of Object.keys(DE)) {
      const dict = DE[ns]!
      const key = Object.keys(dict)[0]!
      expect(ctx.locale.bind(ns)(key), ns + '.' + key).toBe(dict[key])
    }

    await fiber.dispose()
    await ctx.fiber.dispose()
  })

  it('renders English for a key no German dictionary carries', async () => {
    const ctx = await baseContext()
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    ctx.locale.register('probe', LOCALE_ID, { present: 'Vorhanden' })
    ctx.locale.register('probe', 'en', { present: 'Present', absent: 'Absent' })
    ctx.locale.setLocale(LOCALE_ID)
    expect(ctx.locale.bind('probe')('present')).toBe('Vorhanden')
    expect(ctx.locale.bind('probe')('absent')).toBe('Absent')

    await fiber.dispose()
    await ctx.fiber.dispose()
  })

  it('releases the language and every dictionary with its fiber', async () => {
    const ctx = await baseContext()
    const fiber = ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    ctx.locale.setLocale(LOCALE_ID)
    expect(ctx.locale.getLocale().active).toBe(LOCALE_ID)
    expect(ctx.locale.bind('common')('cancel')).toBe(DE['common']!['cancel'])

    await fiber.dispose()
    expect(ctx.locale.getLocale().locales.map(locale => locale.id)).not.toContain(LOCALE_ID)
    expect(ctx.locale.getLocale().active).not.toBe(LOCALE_ID)
    expect(ctx.locale.bind('common')('cancel')).not.toBe(DE['common']!['cancel'])
    await ctx.fiber.dispose()
  })
})

describe('locale-de node half', () => {
  it('keeps the node half inert', () => {
    expect(applyNode).not.toThrow()
  })
})
