import { z } from 'zod'
export const usEconSelector = z.enum([
  'real_gdp',
  'real_personal',
  'real_pce',
  'current_gdp',
  'personal_income',
  'disposable_income',
  'personal_consumption',
  'real_per_capita_personal_income',
  'real_per_capita_pce',
  'current_per_capita_personal_income',
  'current_per_capita_disposable_income',
  'rpp',
  'implicit_regional_price_deflator',
  'employment',
])
export type USEconSelector = z.infer<typeof usEconSelector>
