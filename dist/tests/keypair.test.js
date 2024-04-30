"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const uvu_1 = require("uvu");
const assert = tslib_1.__importStar(require("uvu/assert"));
const ed = tslib_1.__importStar(require("@noble/ed25519"));
const keypair_1 = require("../src/keypair");
const encoding_1 = require("../src/encoding");
const did_1 = require("../src/did");
const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const test = (0, uvu_1.suite)('Keypair');
test('create keypair ed25519', async () => {
    const kp = await keypair_1.KeyPair.create();
    assert.instance(kp, keypair_1.KeyPair);
    assert.is(kp.publicKey.byteLength, 32);
    assert.is(kp.privateKey.byteLength, 32);
});
test('public key string', async () => {
    const kp = await keypair_1.KeyPair.create();
    assert.equal(kp.publicKey, encoding_1.base64Pad.decode(kp.publicKeyStr()));
});
test('did', async () => {
    const kp = await keypair_1.KeyPair.create();
    const did = kp.did();
    assert.equal(kp.publicKey, (0, did_1.didToPublicKeyBytes)(did));
});
test('should sign and verify', async () => {
    const kp = await keypair_1.KeyPair.create();
    const signature = await kp.sign(data);
    assert.ok(await ed.verify(signature, data, kp.publicKey));
});
test('should sign and verify', async () => {
    const kp = await keypair_1.KeyPair.create();
    const signature = await kp.sign(data);
    assert.ok(await ed.verify(signature, data, kp.publicKey));
});
test('should sign and verify from did', async () => {
    const kp = await keypair_1.KeyPair.create();
    const signature = await kp.sign(data);
    assert.ok(await ed.verify(signature, data, (0, did_1.didToPublicKeyBytes)(kp.did())));
});
test('should export/import', async () => {
    const kp = await keypair_1.KeyPair.create();
    const privateKeyHash = kp.export();
    const kp2 = await keypair_1.KeyPair.fromExportedKey(privateKeyHash);
    assert.is(kp.publicKeyStr, kp2.publicKeyStr);
    assert.equal(kp.privateKey, kp2.privateKey);
});
test.run();
