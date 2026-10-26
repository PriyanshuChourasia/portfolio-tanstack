import { AccountTypesAnimation } from './AccountTypesAnimation'
import { NominalAccountAnimation } from './NominalAccountAnimation'
import { PersonalAccountAnimation } from './PersonalAccountAnimation'
import { PersonalRuleAnimation } from './PersonalRuleAnimation'
import { RealAccountAnimation } from './RealAccountAnimation'
import type { ComponentType } from 'react'

// Rendered in place of `<!--widget:name-->` markers inside post/page HTML.
export const articleWidgets: Record<string, ComponentType> = {
  'account-types': AccountTypesAnimation,
  'personal-account': PersonalAccountAnimation,
  'personal-account-rule': PersonalRuleAnimation,
  'real-account': RealAccountAnimation,
  'nominal-account': NominalAccountAnimation,
}
