try {
  const isGlobal = process.env.npm_config_global === 'true'

  if (isGlobal) {
    console.log('\n✓ markdown installed. Run it with:\n\n  markdown\n')
    console.log('  (markdown-ai also works as an alias)\n')
  } else {
    console.log(
      '\n✓ markdown installed. Run it with:\n\n  npx markdown\n\n' +
        '(or markdown-ai: npx markdown-ai)\n\n' +
        '(or reinstall globally for a plain `markdown` command: npm install -g @pcoder/markdown-ai)\n',
    )
  }
} catch {
  // postinstall must never fail the install
}
