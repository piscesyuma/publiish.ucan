import { KeyPair } from './keypair';
import { BuildParams, UcanHeader, UcanPayload, ValidateOptions } from './types';
/**
 * Build a Ucan from the given parameters.
 *
 * @param {import("./types").BuildParams} params
 * @returns {Promise<import('./types').UcanWithJWT>}
 */
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
/**
 * Generate UCAN signature.
 *
 * @param {import("./types").UcanPayload<string>} payload
 * @param {import("./keypair.js").KeyPair} keypair
 *
 * @returns {Promise<import('./types').UcanWithJWT>}
 */
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
/**
 * @param {string} encodedUcan
 * @param {import('./types').ValidateOptions} [options]
 *
 * @returns {Promise<import('./types').Ucan>}
 */
export declare function validate(encodedUcan: string, options?: ValidateOptions): Promise<{
    header: UcanHeader;
    payload: UcanPayload<string>;
    signature: Uint8Array;
}>;
/**
 * Check if input is a encoded UCAN
 *
 * @param {string} encodedUcan
 */
export declare function isUcan(encodedUcan: string): boolean;
//# sourceMappingURL=ucan.d.ts.map