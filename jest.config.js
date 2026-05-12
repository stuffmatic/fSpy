/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*tests.ts', '**/*specs.ts'],
  reporters: ['default', 'jest-junit']
}
