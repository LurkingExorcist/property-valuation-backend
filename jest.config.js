module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/helpers/environment.ts'],
  moduleNameMapper: {
    '^@/(.*)$':  '<rootDir>/src/$1',
    '^tests/(.*)$':  '<rootDir>/tests/$1',
  }
};
