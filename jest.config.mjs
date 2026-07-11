import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Rruga për te aplikacioni Next.js
  dir: './',
})

const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Rregullon importet me @ që përdorim ne
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)