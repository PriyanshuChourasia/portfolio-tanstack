# Markdown-AI

A local-first Markdown workspace you run on your own machine. No account, no cloud — your files stay on your device.

## Install (recommended)

```sh
npm install -g @pcoder/markdown-ai
```

Run it with:

```sh
markdown-ai
```

This starts a small local server and opens the app in your default browser. A config file and your projects are stored on disk at an OS-appropriate default location:

| OS | Location |
|---|---|
| macOS | `~/Library/Application Support/Markdown-AI/` |
| Windows | `%APPDATA%\Markdown-AI\` |
| Linux | `$XDG_CONFIG_HOME/markdown-ai/` (falls back to `~/.config/markdown-ai/`) |

You can see the exact path in use from the app's profile page.

## Local install (alternative)

```sh
npm install @pcoder/markdown-ai
```

Without `-g`, the `markdown-ai` command isn't added to your shell's PATH — run it through npx instead, from the same folder:

```sh
npx markdown-ai
```

## Without installing at all

```sh
npx @pcoder/markdown-ai
```

## License

MIT
