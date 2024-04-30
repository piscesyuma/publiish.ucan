"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utf8 = exports.base58btc = exports.base64url = exports.base64Pad = exports.rfc4648 = void 0;
const tslib_1 = require("tslib");
const base_x_1 = tslib_1.__importDefault(require("base-x"));
/**
 * RFC4648 decode
 *
 * @param {string} string
 * @param {string} alphabet
 * @param {number} bitsPerChar
 * @param {string} name
 * @returns {Uint8Array}
 */
const decode = (string, alphabet, bitsPerChar, name) => {
    // Build the character lookup table:
    /** @type {Record<string, number>} */
    const codes = {};
    for (let i = 0; i < alphabet.length; ++i) {
        codes[alphabet[i]] = i;
    }
    // Count the padding bytes:
    let end = string.length;
    while (string[end - 1] === '=') {
        --end;
    }
    // Allocate the output:
    const out = new Uint8Array(Math.trunc((end * bitsPerChar) / 8));
    // Parse the data:
    let bits = 0; // Number of bits currently in the buffer
    let buffer = 0; // Bits waiting to be written out, MSB first
    let written = 0; // Next byte to write
    for (let i = 0; i < end; ++i) {
        // Read one character from the string:
        const value = codes[string[i]];
        if (value === undefined) {
            throw new SyntaxError(`Non-${name} character`);
        }
        // Append the bits to the buffer:
        buffer = (buffer << bitsPerChar) | value;
        bits += bitsPerChar;
        // Write out some bits if the buffer has a byte's worth:
        if (bits >= 8) {
            bits -= 8;
            out[written++] = 0xff & (buffer >> bits);
        }
    }
    // Verify that we have received just enough bits:
    if (bits >= bitsPerChar || 0xff & (buffer << (8 - bits))) {
        throw new SyntaxError('Unexpected end of data');
    }
    return out;
};
/**
 * RFC4648 encode
 *
 * @param {Uint8Array} data
 * @param {string} alphabet
 * @param {number} bitsPerChar
 * @returns {string}
 */
const encode = (data, alphabet, bitsPerChar) => {
    const pad = alphabet[alphabet.length - 1] === '=';
    const mask = (1 << bitsPerChar) - 1;
    let out = '';
    let bits = 0; // Number of bits currently in the buffer
    let buffer = 0; // Bits waiting to be written out, MSB first
    for (const datum of data) {
        // Slurp data into the buffer:
        buffer = (buffer << 8) | datum;
        bits += 8;
        // Write out as much as we can:
        while (bits > bitsPerChar) {
            bits -= bitsPerChar;
            out += alphabet[mask & (buffer >> bits)];
        }
    }
    // Partial character:
    if (bits) {
        out += alphabet[mask & (buffer << (bitsPerChar - bits))];
    }
    // Add padding characters until we hit a byte boundary:
    if (pad) {
        while ((out.length * bitsPerChar) & 7) {
            out += '=';
        }
    }
    return out;
};
/**
 * RFC4648 Factory
 *
 * @param {Object} options
 * @param {string} options.name
 * @param {string} options.alphabet
 * @param {number} options.bitsPerChar
 */
const rfc4648 = ({ name, bitsPerChar, alphabet, }) => {
    return {
        /**
         * @param {Uint8Array} input
         */
        encode(input) {
            return encode(input, alphabet, bitsPerChar);
        },
        /**
         * @param {string} input
         * @returns {Uint8Array}
         */
        decode(input) {
            return decode(input, alphabet, bitsPerChar, name);
        },
    };
};
exports.rfc4648 = rfc4648;
exports.base64Pad = (0, exports.rfc4648)({
    name: 'base64pad',
    bitsPerChar: 6,
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
});
exports.base64url = (0, exports.rfc4648)({
    name: 'base64url',
    bitsPerChar: 6,
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
});
exports.base58btc = (0, base_x_1.default)('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
exports.utf8 = {
    /**
     * @param {Uint8Array} input
     */
    encode(input) {
        const decoder = new TextDecoder('utf8');
        return decoder.decode(input);
    },
    /**
     * @param {string} input
     * @returns {Uint8Array}
     */
    decode(input) {
        const encoder = new TextEncoder();
        return encoder.encode(input);
    },
};
