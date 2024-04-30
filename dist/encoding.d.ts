import baseX from 'base-x';
/**
 * RFC4648 Factory
 *
 * @param {Object} options
 * @param {string} options.name
 * @param {string} options.alphabet
 * @param {number} options.bitsPerChar
 */
export declare const rfc4648: ({ name, bitsPerChar, alphabet, }: {
    name: string;
    bitsPerChar: number;
    alphabet: string;
}) => {
    /**
     * @param {Uint8Array} input
     */
    encode(input: Uint8Array): string;
    /**
     * @param {string} input
     * @returns {Uint8Array}
     */
    decode(input: string): Uint8Array;
};
export declare const base64Pad: {
    /**
     * @param {Uint8Array} input
     */
    encode(input: Uint8Array): string;
    /**
     * @param {string} input
     * @returns {Uint8Array}
     */
    decode(input: string): Uint8Array;
};
export declare const base64url: {
    /**
     * @param {Uint8Array} input
     */
    encode(input: Uint8Array): string;
    /**
     * @param {string} input
     * @returns {Uint8Array}
     */
    decode(input: string): Uint8Array;
};
export declare const base58btc: baseX.BaseConverter;
export declare const utf8: {
    /**
     * @param {Uint8Array} input
     */
    encode(input: Uint8Array): string;
    /**
     * @param {string} input
     * @returns {Uint8Array}
     */
    decode(input: string): Uint8Array;
};
//# sourceMappingURL=encoding.d.ts.map