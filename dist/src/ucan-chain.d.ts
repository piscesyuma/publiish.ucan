import { Capability, CapabilitySemantics, Ucan, ValidateOptions } from './types';
/**
 * @template A
 * @param {import('./types').CapabilitySemantics<A>} semantics
 * @param {UcanChain} ucan
 */
export declare function findValidCaps<A>(semantics: CapabilitySemantics<A>, ucan: UcanChain): Generator<A, void, unknown>;
/**
 * Represents a UCAN chain with all the proofs parsed into UCAN chains too.
 * - Validates each ucan
 * - Parses all the proofs in a UCAN chain
 * - Validate parent audience matches child issuer
 */
export declare class UcanChain {
    _encoded: string;
    _decoded: Ucan<UcanChain>;
    /**
     * @param {string} encoded
     * @param {import('./types').Ucan<UcanChain>} decoded
     */
    constructor(encoded: string, decoded: Ucan<UcanChain>);
    /**
     * Create an instance of UcanChain from a ucan jwt token
     *
     * @param {string} encodedUcan
     * @param {import('./types').ValidateOptions} [options]
     * @returns {Promise<UcanChain>}
     */
    static fromToken(encodedUcan: string, options?: ValidateOptions): Promise<UcanChain>;
    /**
     * Get valid capabilities for the semantics
     *
     * @template A
     * @param {import('./types').CapabilitySemantics<A>} semantics
     */
    caps<A>(semantics: CapabilitySemantics<A>): any[];
    /**
     * @template A
     * @param {import('./types').Capability} cap
     * @param {import('./types').CapabilitySemantics<A>} semantics
     */
    claim<A>(cap: Capability, semantics: CapabilitySemantics<A>): UcanChain;
    proofs(): UcanChain[];
    audience(): string;
    issuer(): string;
    /**
     * The payload the top level represented by this Chain element.
     * Its proofs are omitted. To access proofs, use `.proofs()`
     *
     * @returns {import('./types').Ucan<never>}
     */
    payload(): {
        payload: {
            prf: any[];
            iss: string;
            aud: string;
            exp: number;
            nbf?: number;
            nnc?: string;
            att: Capability[];
            fct?: import("./types").Fact[];
        };
        header: import("./types").UcanHeader;
        signature: Uint8Array;
    };
    capabilities(): Capability[];
}
//# sourceMappingURL=ucan-chain.d.ts.map