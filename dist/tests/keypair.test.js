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
const uvu_1 = require("uvu");
const assert = __importStar(require("uvu/assert"));
const ed = __importStar(require("@noble/ed25519"));
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
//# sourceMappingURL=keypair.test.js.map