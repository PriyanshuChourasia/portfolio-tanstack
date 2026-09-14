try {
  const isGlobal = process.env.npm_config_global === 'true'

  if (isGlobal) {
    console.log('\n✓ markdown-ai installed. Run it with:\n\n  markdown-ai\n')
  } else {
    console.log(
      '\n✓ markdown-ai installed. Run it with:\n\n  npx markdown-ai\n\n' +
        '(or reinstall globally for a plain `markdown-ai` command: npm install -g @pcoder/markdown-ai)\n',
    )
  }
} catch {
  // postinstall must never fail the install
}
