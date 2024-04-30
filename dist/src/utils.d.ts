import { KeyType, UcanPayload } from './types';
/**
 * Concat Uint8Arrays
 *
 * @param {Uint8Array[]} arrays
 */
export declare function concatUint8(arrays: Uint8Array[]): Uint8Array;
/**
 * Returns true if the two passed Uint8Arrays have the same content
 *
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 */
export declare function equals(a: Uint8Array, b: Uint8Array): boolean;
/**
 * Serialise Object to JWT style string.
 *
 * @param {any} input - JSON input
 */
export declare function serialize(input: any): string;
/**
 * Deserialise Object to JWT style string.
 *
 * @param {string} input
 */
export declare function deserialize(input: string): any;
/**
 * JWT algorithm to be used in a JWT header.
 *
 * @param {import('./types.js').KeyType} keyType
 */
export declare function jwtAlgorithm(keyType: KeyType): string;
/**
 * Check if a UCAN is expired.
 *
 * @param {import('./types.js').UcanPayload} payload
 */
export declare function isExpired(payload: UcanPayload): boolean;
/**
 * Check if a UCAN is not active yet.
 *
 * @param {import('./types.js').UcanPayload} payload
 */
export declare function isTooEarly(payload: UcanPayload): boolean;
//# sourceMappingURL=utils.d.ts.map