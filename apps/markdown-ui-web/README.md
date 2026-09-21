# Markdown-AI

A local-first Markdown workspace you run on your own machine. No account, no cloud — your files stay on your device.

## Install

```sh
npm install -g @pcoder/markdown-ai
```

Run it with:

```sh
markdown
```

This starts a small local server and opens the app in your default browser. The `markdown-ai` command is also available as an alias.

A config file and your projects are stored on disk at an OS-appropriate default location:

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

Without `-g`, the `markdown` command isn't added to your shell's PATH — run it through npx instead:

```sh
npx markdown
```

## Without installing at all

```sh
npx @pcoder/markdown-ai
```

## License

MIT
