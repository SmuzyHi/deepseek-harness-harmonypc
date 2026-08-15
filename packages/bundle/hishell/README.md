# @deepseek-ai/dsh-bundle-hishell —— HiShell 部署组合补丁层（骨架）

> 设计见 `.agents/notes/proposed/hishell/2026-08-14-hishell-bundle.md`（纯中文归档）。
> 状态：**设计骨架**——组合行随 PR-1/6/7/8 落地逐步填充；当前不引用任何不存在的行，非 openharmony 平台 no-op。

openharmony 部署 = 上游树 + 本 bundle 引用（`dsh.profile.bundles` 或 `--patch` overlay）+ hishell-onboard 初始化（fs-compat .so / 系统 rg / secrets 包装命令）。

## 组合行（规划）

| PR | 行 | 内容 |
|---|---|---|
| PR-8 | dsh-sandbox-local | 后端探测：内核优先、fs-fence 兜底 |
| PR-7 | （无需配置） | tool-fs-search 已改 PATH 解析系统 rg |
| PR-6 | （无需配置） | credentials-local 能力判定内建 |
| PR-2 | dsh-web-launcher | `--expose-internals` 探测附加/明确报错 |
