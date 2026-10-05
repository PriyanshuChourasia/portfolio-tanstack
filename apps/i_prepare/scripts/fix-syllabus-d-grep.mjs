import { readFileSync } from 'node:fs'
for (const file of ['src/features/ml-mentor/data/syllabus-c.ts', 'src/features/ml-mentor/data/syllabus-d.ts']) {
  const lines = readFileSync(file, 'utf8').split('\n')
  let mode = false
  for (let i = 0; i < lines.length; i += 1) {
    if (/^\s*exampleCode:\s*$/.test(lines[i])) {
      mode = true
      console.log(`\n=== ${file} #${i + 1} ===`)
    }
    if (mode) {
      console.log(lines[i])
      if (/^\s*`[,\s]*$/.test(lines[i].trim()) || lines[i].trim().startsWith('`')) {
        mode = false
      }
    }
  }
}
