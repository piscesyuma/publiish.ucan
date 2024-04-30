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
exports.verify = exports.hasPrefix = exports.parseMagicBytes = exports.didKeyType = exports.didToPublicKeyBytes = exports.parse = exports.publicKeyBytesToDid = exports.EDWARDS_DID_PREFIX = exports.BASE58_DID_PREFIX = void 0;
const utils_1 = require("./utils");
const ed = __importStar(require("@noble/ed25519"));
const encoding_1 = require("./encoding");
exports.BASE58_DID_PREFIX = 'did:key:z';
exports.EDWARDS_DID_PREFIX = new Uint8Array([0xed, 0x01]);
function publicKeyBytesToDid(publicKeyBytes) {
    const prefixedBytes = (0, utils_1.concatUint8)([exports.EDWARDS_DID_PREFIX, publicKeyBytes]);
    return exports.BASE58_DID_PREFIX + encoding_1.base58btc.encode(prefixedBytes);
}
exports.publicKeyBytesToDid = publicKeyBytesToDid;
function parse(did) {
    if (!(typeof did === 'string')) {
        throw new TypeError('did must be a string');
    }
    if (!did.startsWith(exports.BASE58_DID_PREFIX)) {
        throw new Error('Please use a base58-encoded DID formatted `did:key:z...`');
    }
    const didWithoutPrefix = did.slice(exports.BASE58_DID_PREFIX.length);
    const magicBytes = encoding_1.base58btc.decode(didWithoutPrefix);
    const keyAndType = parseMagicBytes(magicBytes);
    return {
        prefix: exports.BASE58_DID_PREFIX,
        publicKey: keyAndType.keyBytes,
        type: keyAndType.type,
    };
}
exports.parse = parse;
function didToPublicKeyBytes(did) {
    const parsed = parse(did);
    return parsed.publicKey;
}
exports.didToPublicKeyBytes = didToPublicKeyBytes;
function didKeyType(did) {
    const parsed = parse(did);
    return parsed.type;
}
exports.didKeyType = didKeyType;
function parseMagicBytes(key) {
    if (hasPrefix(key, exports.EDWARDS_DID_PREFIX)) {
        return {
            keyBytes: key.slice(exports.EDWARDS_DID_PREFIX.byteLength),
            type: 'ed25519',
        };
    }
    throw new Error('Unsupported key algorithm. Try using ed25519.');
}
exports.parseMagicBytes = parseMagicBytes;
function hasPrefix(prefixedKey, prefix) {
    return (0, utils_1.equals)(prefix, prefixedKey.subarray(0, prefix.byteLength));
}
exports.hasPrefix = hasPrefix;
function verify(data, signature, did) {
    return ed.verify(signature, encoding_1.utf8.decode(data), didToPublicKeyBytes(did));
}
exports.verify = verify;
//# sourceMappingURL=did.js.map