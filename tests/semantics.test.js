"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable unicorn/no-null */
const uvu_1 = require("uvu");
const assert = __importStar(require("uvu/assert"));
const errors_1 = require("../src/errors");
const semantics_1 = require("../src/semantics");
(0, uvu_1.test)('should fail with resource as a number', async () => {
    const parsed = semantics_1.storageSemantics.tryParsing({
        with: 1000,
        can: 'upload/*',
    });
    assert.instance(parsed, errors_1.CapabilityParseError);
    assert.is(parsed.message, '"with" must be a string.');
});
(0, uvu_1.test)('should fail with ability as a number', async () => {
    const parsed = semantics_1.storageSemantics.tryParsing({
        with: 'storage://sss',
        can: 122,
    });
    assert.instance(parsed, errors_1.CapabilityParseError);
    assert.is(parsed.message, '"can" must be a string.');
});
(0, uvu_1.test)('should fail with multihash as a number', async () => {
    const parsed = semantics_1.storageSemantics.tryParsing({
        with: 'storage://sss',
        can: 'upload/*',
        mh: 222,
    });
    assert.instance(parsed, errors_1.CapabilityParseError);
    assert.is(parsed.message, '"mh" must be a string or undefined.');
});
(0, uvu_1.test)('should fail with unknown ability', async () => {
    const parsed = semantics_1.storageSemantics.tryParsing({
        with: 'storage://sss',
        can: 'upload/111',
        mh: 'sss',
    });
    assert.instance(parsed, errors_1.CapabilityParseError);
    assert.is(parsed.message, 'Ability upload/111 is not supported.');
});
(0, uvu_1.test)('should fail with unknown resource prefix', async () => {
    const parsed = semantics_1.storageSemantics.tryParsing({
        with: 'random://sss',
        can: 'upload/111',
    });
    assert.instance(parsed, errors_1.CapabilityParseError);
    assert.is(parsed.message, 'Ability upload/111 is not supported.');
});
(0, uvu_1.test)('should fail with unknown resource prefix', async () => {
    const parsed = semantics_1.storageSemantics.tryParsing({
        with: 'random://sss',
        can: 'upload/111',
    });
    assert.instance(parsed, errors_1.CapabilityParseError);
    assert.is(parsed.message, 'Ability upload/111 is not supported.');
});
(0, uvu_1.test)('should parse and return proper representation', async () => {
    const parsed = semantics_1.storageSemantics.tryParsing({
        with: 'storage://sss',
        can: 'upload/IMPORT',
        mh: 'assasd',
    });
    assert.equal(parsed, {
        with: 'storage://sss',
        can: 'upload/IMPORT',
        mh: 'assasd',
    });
});
uvu_1.test.run();
//# sourceMappingURL=semantics.test.js.map