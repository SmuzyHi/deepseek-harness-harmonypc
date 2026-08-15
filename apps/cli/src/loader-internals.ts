/**
 * PR-2（hishell）：vendored Cordis loader（`vendor/loader/src/internal.ts`）访问
 * `internal/modules/esm/loader` 有两条路：`--expose-internals` 旗标，或
 * `node-addon-require-builtin` 原生预编译（npm 平台分包——openharmony/musl
 * 无对应变体，实测 addon 路径在本机不可用）。
 *
 * 无旗标且 addon 不可用时，插件树的 ESM 加载在深层失败（裸 `npx dsh web`
 * 实测启动失败）；此探测在启动早期给出明确报错与修复指引。
 * @module @deepseek-ai/dsh/loader-internals
 */

import { createRequire } from 'node:module'

/**
 * 探测 internal 模块加载器访问是否可用（旗标或 addon 任一即够）。
 * @returns `true` 时 vendored loader 的 internal 路径可用。
 */
export function loaderInternalsAvailable(): boolean {
  if (process.execArgv.includes('--expose-internals')) return true
  try {
    const require = createRequire(import.meta.url)
    const { requireBuiltin } = require('node-addon-require-builtin') as {
      requireBuiltin: (id: string) => unknown
    }
    return requireBuiltin('internal/modules/esm/loader') !== undefined
  } catch {
    return false
  }
}

/**
 * 启动早期断言：不可用时抛出带修复指引的错误（fail fast，而非深层加载失败）。
 * @throws 当 internal 模块加载器两条路都不可用时。
 */
export function assertLoaderInternals(): void {
  if (loaderInternalsAvailable()) return
  throw new Error(
    'dsh: 无法访问 Node internal 模块加载器（vendored Cordis loader 所需）。'
    + '修复：用 `node --expose-internals` 启动（如 onboard 生成的 dsh-web 启动器），'
    + '或安装 node-addon-require-builtin 的 musl/arm64 预编译平台包（见 dsh-hishell PR-2）。',
  )
}
