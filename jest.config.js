/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'jsdom',
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    transform: {
        "^.+\\.js$": "babel-jest"
    },
    moduleNameMapper: {
        '\\.css$': 'identity-obj-proxy'
    }
};

module.exports = config;