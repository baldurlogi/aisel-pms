export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'apps/api/src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '../../../coverage',
  testEnvironment: 'node',
};
