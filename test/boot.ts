const JasmineCore = require('jasmine-core')
// @ts-ignore
global.getJasmineRequireObj = () => JasmineCore

require('jasmine-ajax')