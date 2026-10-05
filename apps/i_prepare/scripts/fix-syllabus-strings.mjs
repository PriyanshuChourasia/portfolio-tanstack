/**
 * One-off repair (v3): exampleCode values in the syllabus data files were
 * written with real newlines inside single-quoted strings (invalid TS).
 *
 * Each broken block looks like:
 *   exampleCode:
 *     'line one
 *     line two
 *     last line',
 *
 * Rebuild it as one valid single-line single-quoted string with \n escapes.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const files = process.argv.slice(2)

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n')
  const out = []
  let fixed = 0

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]

    if (/^\s*exampleCode:\s*$/.test(line)) {
      // Collect the broken string body until a line ending in "'," (or "',").
      const bodyLines = []
      let j = i + 1
      let closed = false
      while (j < lines.length) {
        bodyLines.push(lines[j])
        if (/"\s*,\s*$|'\s*,\s*$/.test(lines[j].trimEnd())) {
          closed = true
          break
        }
        j += 1
      }
      if (!closed) {
        out.push(line)
        continue
      }

      // Join, strip the wrapping quotes, and re-escape for a single-line literal.
      let body = bodyLines.join('\n')
      body = body.replace(/^\s*'/, '').replace(/'\s*,\s*$/, '')
      body = body.replace(/\\n/g, '\n').replace(/\\'/g, "'")
      const escaped = body
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
      out.push("        '" + escaped + "',")
      fixed += 1
      i = j
      continue
    }

    out.push(line)
  }

  writeFileSync(file, out.join('\n'))
  console.log(`${file}: rebuilt ${fixed} exampleCode strings`)
}
