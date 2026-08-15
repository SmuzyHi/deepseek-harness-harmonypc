/**
 * Package-owned invariant companion for `@deepseek-ai/dsh-bundle-hishell`.
 * @module @deepseek-ai/dsh-bundle-hishell/invariant
 */

import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = '@deepseek-ai/dsh-bundle-hishell'

/** Cordis companion plugin name. */
export const name = 'hishell-bundle-invariant'
/** Service required before the companion can register. */
export const inject = ['invariants']

/**
 * No runtime invariant: the bundle contributes only a patch layer (composition
 * rows gated by openharmony capability) and registry-disposed children; the
 * package holds no mutable state of its own to audit.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
