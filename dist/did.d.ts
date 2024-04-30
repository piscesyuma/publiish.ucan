import { KeyType } from './types';
export declare const BASE58_DID_PREFIX = "did:key:z";
export declare const EDWARDS_DID_PREFIX: Uint8Array;
export declare function publicKeyBytesToDid(publicKeyBytes: Uint8Array): string;
export declare function parse(did: string): {
    prefix: string;
    publicKey: Uint8Array;
    type: KeyType;
};
export declare function didToPublicKeyBytes(did: string): Uint8Array;
export declare function didKeyType(did: string): KeyType;
export declare function parseMagicBytes(key: Uint8Array): {
    keyBytes: Uint8Array;
    type: KeyType;
};
export declare function hasPrefix(prefixedKey: Uint8Array, prefix: Uint8Array): boolean;
export declare function verify(data: string, signature: Uint8Array, did: string): Promise<boolean>;
//# sourceMappingURL=did.d.ts.map