"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable unicorn/no-null */
const uvu_1 = require("uvu");
const assert = tslib_1.__importStar(require("uvu/assert"));
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
