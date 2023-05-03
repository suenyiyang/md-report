import type { UserConfig } from '@commitlint/types'

const defineConfig = (config: UserConfig): UserConfig => (config)

export default defineConfig({
  extends: ['@commitlint/config-conventional'],
})
