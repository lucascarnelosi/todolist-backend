import { type Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts']
}

export default config