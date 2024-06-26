"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTooEarly = exports.isExpired = exports.jwtAlgorithm = exports.deserialize = exports.serialize = exports.equals = exports.concatUint8 = void 0;
const encoding_1 = require("./encoding");
/**
 * Concat Uint8Arrays
 *
 * @param {Uint8Array[]} arrays
 */
function concatUint8(arrays) {
    let totalLength = 0;
    for (const arr of arrays) {
        totalLength += arr.length;
    }
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}
exports.concatUint8 = concatUint8;
/**
 * Returns true if the two passed Uint8Arrays have the same content
 *
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 */
function equals(a, b) {
    if (a === b) {
        return true;
    }
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    for (let i = 0; i < a.byteLength; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
exports.equals = equals;
/**
 * Serialise Object to JWT style string.
 *
 * @param {any} input - JSON input
 */
function serialize(input) {
    return encoding_1.base64url.encode(encoding_1.utf8.decode(JSON.stringify(input)));
}
exports.serialize = serialize;
/**
 * Deserialise Object to JWT style string.
 *
 * @param {string} input
 */
function deserialize(input) {
    let headerUtf8;
    try {
        const decodedHeader = encoding_1.base64url.decode(input);
        headerUtf8 = encoding_1.utf8.encode(decodedHeader);
    }
    catch {
        throw new Error(`Can't parse: ${input}: Can't parse as base64url.`);
    }
    try {
        return JSON.parse(headerUtf8);
    }
    catch {
        throw new Error(`Can't parse: ${input}: Can't parse base64url encoded JSON inside.`);
    }
}
exports.deserialize = deserialize;
/**
 * JWT algorithm to be used in a JWT header.
 *
 * @param {import('./types.js').KeyType} keyType
 */
function jwtAlgorithm(keyType) {
    switch (keyType) {
        case 'ed25519':
            return 'EdDSA';
        default:
            throw new Error(`Unknown KeyType "${keyType}"`);
    }
}
exports.jwtAlgorithm = jwtAlgorithm;
/**
 * Check if a UCAN is expired.
 *
 * @param {import('./types.js').UcanPayload} payload
 */
function isExpired(payload) {
    return payload.exp <= Math.floor(Date.now() / 1000);
}
exports.isExpired = isExpired;
/**
 * Check if a UCAN is not active yet.
 *
 * @param {import('./types.js').UcanPayload} payload
 */
function isTooEarly(payload) {
    if (!payload.nbf) {
        return false;
    }
    return payload.nbf > Math.floor(Date.now() / 1000);
}
exports.isTooEarly = isTooEarly;
