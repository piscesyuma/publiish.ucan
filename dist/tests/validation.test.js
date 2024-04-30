"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const uvu_1 = require("uvu");
const assert = tslib_1.__importStar(require("uvu/assert"));
const encoding_1 = require("../src/encoding");
const ucan_1 = require("../src/ucan");
const utils_1 = require("../src/utils");
(0, uvu_1.test)('should fail with string "test"', async () => {
    try {
        await (0, ucan_1.validate)('test');
        assert.unreachable('should have thrown');
    }
    catch (error) {
        assert.instance(error, Error);
        assert.match(error.message, `Can't parse UCAN: test: Expected JWT format: 3 dot-separated base64url-encoded values.`);
    }
});
(0, uvu_1.test)('should fail with string "test.test"', async () => {
    try {
        await (0, ucan_1.validate)('test.test');
        assert.unreachable('should have thrown');
    }
    catch (error) {
        assert.instance(error, Error);
        assert.match(error.message, `Can't parse UCAN: test.test: Expected JWT format: 3 dot-separated base64url-encoded values.`);
    }
});
(0, uvu_1.test)('should fail with string bad json header', async () => {
    try {
        await (0, ucan_1.validate)('test.test.test');
        assert.unreachable('should have thrown');
    }
    catch (error) {
        assert.instance(error, Error);
        assert.match(error.message, `Can't parse: test: Can't parse base64url encoded JSON inside.`);
    }
});
(0, uvu_1.test)('should fail with non base64url header', async () => {
    try {
        await (0, ucan_1.validate)('test*.test.test');
        assert.unreachable('should have thrown');
    }
    catch (error) {
        assert.instance(error, Error);
        assert.match(error.message, `Can't parse: test*: Can't parse as base64url.`);
    }
});
(0, uvu_1.test)('should fail with non base64url payload', async () => {
    const header = (0, utils_1.serialize)({ ss: 1 });
    try {
        await (0, ucan_1.validate)(`${header}.test*.test`);
        assert.unreachable('should have thrown');
    }
    catch (error) {
        assert.instance(error, Error);
        assert.match(error.message, `Can't parse: test*: Can't parse as base64url.`);
    }
});
(0, uvu_1.test)('should fail with bad json payload', async () => {
    const header = (0, utils_1.serialize)({ ss: 1 });
    try {
        await (0, ucan_1.validate)(`${header}.test.test`);
        assert.unreachable('should have thrown');
    }
    catch (error) {
        assert.instance(error, Error);
        assert.match(error.message, `Can't parse: test: Can't parse base64url encoded JSON inside.`);
    }
});
(0, uvu_1.test)('should fail with non base64url signature', async () => {
    const header = (0, utils_1.serialize)({ ss: 1 });
    const payload = (0, utils_1.serialize)({ ss: 1 });
    try {
        await (0, ucan_1.validate)(`${header}.${payload}.test*`);
        assert.unreachable('should have thrown');
    }
    catch (error) {
        assert.instance(error, SyntaxError);
        assert.match(error.message, `Non-base64url character`);
    }
});
(0, uvu_1.test)('should fail with bad alg', async () => {
    const kp = await ucan_1.KeyPair.create();
    const header = (0, utils_1.serialize)({ alg: 'EdDSAa' });
    const payload = (0, utils_1.serialize)({ iss: kp.did() });
    const sig = await kp.sign(encoding_1.utf8.decode(`${header}.${payload}`));
    const jwt = `${header}.${payload}.${encoding_1.base64url.encode(sig)}`;
    try {
        await (0, ucan_1.validate)(jwt);
        assert.unreachable('should have thrown');
    }
    catch (error) {
        assert.instance(error, Error);
        assert.match(error.message, `Invalid UCAN: ${jwt}: Issuer key type does not match UCAN's alg property.`);
    }
});
(0, uvu_1.test)('should fail with bad signature', async () => {
    const kp = await ucan_1.KeyPair.create();
    const header = (0, utils_1.serialize)({ alg: 'EdDSA' });
    const payload = (0, utils_1.serialize)({ iss: kp.did() });
    const sig = await kp.sign(encoding_1.utf8.decode(`${header}.${payload}BAD`));
    const jwt = `${header}.${payload}.${encoding_1.base64url.encode(sig)}`;
    try {
        await (0, ucan_1.validate)(jwt);
        assert.unreachable('should have thrown');
    }
    catch (error) {
        assert.instance(error, Error);
        assert.match(error.message, `Invalid UCAN: ${jwt}: Signature invalid.`);
    }
});
(0, uvu_1.test)('should fail with expired jwt', async () => {
    const kp = await ucan_1.KeyPair.create();
    const header = (0, utils_1.serialize)({ alg: 'EdDSA' });
    const payload = (0, utils_1.serialize)({
        iss: kp.did(),
        exp: Math.floor(Date.now() / 1000) - 1000,
    });
    const sig = await kp.sign(encoding_1.utf8.decode(`${header}.${payload}`));
    const jwt = `${header}.${payload}.${encoding_1.base64url.encode(sig)}`;
    try {
        await (0, ucan_1.validate)(jwt);
        assert.unreachable('should have thrown');
    }
    catch (error) {
        assert.instance(error, Error);
        assert.match(error.message, `Invalid UCAN: ${jwt}: Expired.`);
    }
});
(0, uvu_1.test)('should fail with not yet active jwt', async () => {
    const kp = await ucan_1.KeyPair.create();
    const header = (0, utils_1.serialize)({ alg: 'EdDSA' });
    const payload = (0, utils_1.serialize)({
        iss: kp.did(),
        nbf: Math.floor(Date.now() / 1000) + 1000,
    });
    const sig = await kp.sign(encoding_1.utf8.decode(`${header}.${payload}`));
    const jwt = `${header}.${payload}.${encoding_1.base64url.encode(sig)}`;
    try {
        await (0, ucan_1.validate)(jwt);
        assert.unreachable('should have thrown');
    }
    catch (error) {
        assert.instance(error, Error);
        assert.match(error.message, `Invalid UCAN: ${jwt}: Not active yet (too early).`);
    }
});
uvu_1.test.run();
