"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utf8 = exports.base58btc = exports.base64url = exports.base64Pad = exports.rfc4648 = void 0;
const base_x_1 = __importDefault(require("base-x"));
const decode = (string, alphabet, bitsPerChar, name) => {
    const codes = {};
    for (let i = 0; i < alphabet.length; ++i) {
        codes[alphabet[i]] = i;
    }
    let end = string.length;
    while (string[end - 1] === '=') {
        --end;
    }
    const out = new Uint8Array(Math.trunc((end * bitsPerChar) / 8));
    let bits = 0;
    let buffer = 0;
    let written = 0;
    for (let i = 0; i < end; ++i) {
        const value = codes[string[i]];
        if (value === undefined) {
            throw new SyntaxError(`Non-${name} character`);
        }
        buffer = (buffer << bitsPerChar) | value;
        bits += bitsPerChar;
        if (bits >= 8) {
            bits -= 8;
            out[written++] = 0xff & (buffer >> bits);
        }
    }
    if (bits >= bitsPerChar || 0xff & (buffer << (8 - bits))) {
        throw new SyntaxError('Unexpected end of data');
    }
    return out;
};
const encode = (data, alphabet, bitsPerChar) => {
    const pad = alphabet[alphabet.length - 1] === '=';
    const mask = (1 << bitsPerChar) - 1;
    let out = '';
    let bits = 0;
    let buffer = 0;
    for (const datum of data) {
        buffer = (buffer << 8) | datum;
        bits += 8;
        while (bits > bitsPerChar) {
            bits -= bitsPerChar;
            out += alphabet[mask & (buffer >> bits)];
        }
    }
    if (bits) {
        out += alphabet[mask & (buffer << (bitsPerChar - bits))];
    }
    if (pad) {
        while ((out.length * bitsPerChar) & 7) {
            out += '=';
        }
    }
    return out;
};
const rfc4648 = ({ name, bitsPerChar, alphabet, }) => {
    return {
        encode(input) {
            return encode(input, alphabet, bitsPerChar);
        },
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
    encode(input) {
        const decoder = new TextDecoder('utf8');
        return decoder.decode(input);
    },
    decode(input) {
        const encoder = new TextEncoder();
        return encoder.encode(input);
    },
};
//# sourceMappingURL=encoding.js.map