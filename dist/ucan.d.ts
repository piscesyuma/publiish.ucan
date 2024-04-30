import { KeyPair } from './keypair';
import { BuildParams, UcanHeader, UcanPayload, ValidateOptions } from './types';
export declare function build(params: BuildParams): Promise<{
    header: {
        alg: string;
        typ: string;
        ucv: string;
    };
    payload: UcanPayload<string>;
    signature: Uint8Array;
    jwt: string;
}>;
export declare function sign(payload: UcanPayload<string>, keypair: KeyPair): Promise<{
    header: {
        alg: string;
        typ: string;
        ucv: string;
    };
    payload: UcanPayload<string>;
    signature: Uint8Array;
    jwt: string;
}>;
export declare function validate(encodedUcan: string, options?: ValidateOptions): Promise<{
    header: UcanHeader;
    payload: UcanPayload<string>;
    signature: Uint8Array;
}>;
export declare function isUcan(encodedUcan: string): boolean;
//# sourceMappingURL=ucan.d.ts.map