//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import { globalIgnores } from 'eslint/config'

export default [
  ...tanstackConfig,
  // shadcn/ui primitives are generated code — don't lint them
  globalIgnores(['src/components/ui/**']),
]
