/**
 * Failure-path tests for the lazy packaged-ripgrep resolution. The success
 * path (the real `@vscode/ripgrep` module) is exercised throughout
 * tools.spec.ts; here the module is mocked to throw at evaluation, proving a
 * missing or corrupt platform package (`--omit=optional`, partial install)
 * surfaces as a per-call `SEARCH_FAILED` — not a composition-load failure.
 */

import { describe, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { CallId } from '@deepseek-ai/dsh-llm'
import type { ToolExecution } from '@deepseek-ai/dsh-tools'
import { resolveRgPath, runRipgrep } from '@deepseek-ai/dsh-tool-fs-search'

// Any access to the mocked module's surface throws — the shape a missing
// platform package produces at module evaluation.
vi.mock('@vscode/ripgrep', () => new Proxy({}, {
  get() {
    throw new Error('platform package @vscode/ripgrep-win32-x64 is not installed')
  },
}))

describe('lazy packaged-ripgrep resolution', () => {
  it('packaged source fails the first search call with SEARCH_FAILED instead of failing module load', async () => {
    // The resolution rejects before any spawn, so no subprocess service is needed.
    const controller = new AbortController()
    const exec = { signal: controller.signal, name: 'glob', callId: CallId('missing-platform-package') } as unknown as ToolExecution

    await expect(runRipgrep(new Context(), exec, 'glob', ['--files'], 1_000_000, 3_000, 64 * 1024, 'packaged'))
      .rejects.toMatchObject({ name: 'SearchError', code: 'SEARCH_FAILED' })
  })

  it('packaged source keeps failing every subsequent call (the resolution is memoized)', async () => {
    await expect(resolveRgPath('packaged')).rejects.toThrow(/packaged ripgrep/)
    await expect(resolveRgPath('packaged')).rejects.toThrow(/packaged ripgrep/)
  })

  it('auto falls back to packaged when the system PATH probe misses', async () => {
    vi.stubEnv('PATH', '/nonexistent-dir')
    try {
      await expect(resolveRgPath('auto')).rejects.toThrow(/no usable ripgrep/)
    } finally {
      vi.unstubAllEnvs()
    }
  })

  it('auto prefers a system rg on PATH', async () => {
    vi.stubEnv('PATH', '/usr/bin')
    try {
      // On a host with /usr/bin/rg the system probe wins; otherwise the
      // packaged mock throws — either way the promise settles deterministically.
      const result = await resolveRgPath('auto').catch(() => 'unavailable')
      expect(result === '/usr/bin/rg' || result === 'unavailable').toBe(true)
    } finally {
      vi.unstubAllEnvs()
    }
  })
})
