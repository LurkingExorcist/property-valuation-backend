module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setup/setEnvironment.ts'],
  moduleNameMapper: {
    '^@/(.*)$':  '<rootDir>/src/$1',
    '^tests/(.*)$':  '<rootDir>/tests/$1',
  }
};
