import { Capability, CapabilitySemantics, Ucan, ValidateOptions } from './types';
export declare function findValidCaps<A>(semantics: CapabilitySemantics<A>, ucan: UcanChain): Generator<A, void, unknown>;
export declare class UcanChain {
    _encoded: string;
    _decoded: Ucan<UcanChain>;
    constructor(encoded: string, decoded: Ucan<UcanChain>);
    static fromToken(encodedUcan: string, options?: ValidateOptions): Promise<UcanChain>;
    caps<A>(semantics: CapabilitySemantics<A>): {
        root: UcanChain;
        cap: A;
    }[];
    claim<A>(cap: Capability, semantics: CapabilitySemantics<A>): UcanChain;
    proofs(): UcanChain[];
    audience(): string;
    issuer(): string;
    payload(): {
        payload: {
            prf: never[];
            iss: string;
            aud: string;
            exp: number;
            nbf?: number | undefined;
            nnc?: string | undefined;
            att: Capability[];
            fct?: import("./types").Fact[] | undefined;
        };
        header: import("./types").UcanHeader;
        signature: Uint8Array;
    };
    capabilities(): Capability[];
}
//# sourceMappingURL=ucan-chain.d.ts.map