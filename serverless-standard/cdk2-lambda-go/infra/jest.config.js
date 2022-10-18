module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  reporters: [
    'default',
    [ 'jest-junit', {
      outputDirectory: '<rootDir>/../../testreports',
      outputName: 'report-infra-cdk2-lambda-go.xml'     
    } ]
  ]
};
