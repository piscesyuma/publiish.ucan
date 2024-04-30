import { KeyType } from './types';
export declare const BASE58_DID_PREFIX = "did:key:z";
/** https://github.com/multiformats/multicodec/blob/e9ecf587558964715054a0afcc01f7ace220952c/table.csv#L94 */
export declare const EDWARDS_DID_PREFIX: Uint8Array;
/**
 * Convert a public key in bytes to a DID (did:key).
 *
 * @param {Uint8Array} publicKeyBytes
 */
export declare function publicKeyBytesToDid(publicKeyBytes: Uint8Array): string;
/**
 * Parse supported did:key types
 *
 * @param {string} did
 */
export declare function parse(did: string): {
    prefix: string;
    publicKey: Uint8Array;
    type: KeyType;
};
/**
 * Convert DID to public in bytes
 *
 * @param {string} did
 */
export declare function didToPublicKeyBytes(did: string): Uint8Array;
/**
 * Get did key type
 *
 * @param {string} did
 */
export declare function didKeyType(did: string): KeyType;
/**
 * @param {Uint8Array} key
 * @returns {{keyBytes: Uint8Array, type: import('./types.js').KeyType}}
 */
export declare function parseMagicBytes(key: Uint8Array): {
    keyBytes: Uint8Array;
    type: KeyType;
};
/**
 * Determines if a Uint8Array has a given indeterminate length-prefix.
 *
 * @param {Uint8Array} prefixedKey
 * @param {Uint8Array} prefix
 */
export declare function hasPrefix(prefixedKey: Uint8Array, prefix: Uint8Array): boolean;
/**
 * @param {string } data
 * @param {Uint8Array} signature
 * @param {string} did
 */
export declare function verify(data: string, signature: Uint8Array, did: string): Promise<boolean>;
//# sourceMappingURL=did.d.ts.map