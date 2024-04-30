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
exports.KeyPair = void 0;
const ed = __importStar(require("@noble/ed25519"));
const did_1 = require("./did");
const encoding_1 = require("./encoding");
class KeyPair {
    constructor(privateKey, publicKey) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.pubStr = undefined;
    }
    static async create() {
        const privateKeyRaw = ed.utils.randomPrivateKey();
        const publicKey = await ed.getPublicKey(privateKeyRaw);
        return new KeyPair(privateKeyRaw, publicKey);
    }
    static async fromExportedKey(key) {
        const privateKey = encoding_1.base64Pad.decode(key);
        return new KeyPair(privateKey, await ed.getPublicKey(privateKey));
    }
    publicKeyStr() {
        if (this.pubStr === undefined) {
            this.pubStr = encoding_1.base64Pad.encode(this.publicKey);
        }
        return this.pubStr;
    }
    did() {
        return (0, did_1.publicKeyBytesToDid)(this.publicKey);
    }
    sign(msg) {
        return ed.sign(msg, this.privateKey);
    }
    export() {
        return encoding_1.base64Pad.encode(this.privateKey);
    }
}
exports.KeyPair = KeyPair;
//# sourceMappingURL=keypair.js.map