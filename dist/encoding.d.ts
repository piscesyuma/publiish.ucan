import baseX from 'base-x';
export declare const rfc4648: ({ name, bitsPerChar, alphabet, }: {
    name: string;
    bitsPerChar: number;
    alphabet: string;
}) => {
    encode(input: Uint8Array): string;
    decode(input: string): Uint8Array;
};
export declare const base64Pad: {
    encode(input: Uint8Array): string;
    decode(input: string): Uint8Array;
};
export declare const base64url: {
    encode(input: Uint8Array): string;
    decode(input: string): Uint8Array;
};
export declare const base58btc: baseX.BaseConverter;
export declare const utf8: {
    encode(input: Uint8Array): string;
    decode(input: string): Uint8Array;
};
//# sourceMappingURL=encoding.d.ts.map