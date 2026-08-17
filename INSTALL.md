# INSTALL — HarmonyOS PC one-command install

## One-command install (HarmonyOS PC)

On a HarmonyOS PC (openharmony / musl / hmdfs), one command installs and self-checks `dsh`:

```sh
curl -fsSL "https://atomgit.com/api/v5/repos/Smuzy/hishell-bootstrap/raw/install-dsh.sh" | sh
```

The installer bootstraps a musl node runtime, installs the official `@deepseek-ai/dsh` package via the npmmirror registry, applies the hishell platform patches (tracked under the `hishell-v*` release line), and runs a self-check (web smoke + session persistence regression). Use the bootstrap entry point for the full agent environment instead.

