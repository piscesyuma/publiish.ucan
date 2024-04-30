import { KeyType, UcanPayload } from './types';
export declare function concatUint8(arrays: Uint8Array[]): Uint8Array;
export declare function equals(a: Uint8Array, b: Uint8Array): boolean;
export declare function serialize(input: any): string;
export declare function deserialize(input: string): any;
export declare function jwtAlgorithm(keyType: KeyType): string;
export declare function isExpired(payload: UcanPayload): boolean;
export declare function isTooEarly(payload: UcanPayload): boolean;
//# sourceMappingURL=utils.d.ts.map