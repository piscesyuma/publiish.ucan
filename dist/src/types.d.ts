import type { KeyPair } from './keypair';
import type { CapabilityEscalationError, CapabilityParseError, CapabilityUnrelatedError } from './errors';
export type KeyType = 'rsa' | 'ed25519' | 'bls12-381';
export type Fact = Record<string, unknown>;
export type CanType = 'upload/IMPORT' | 'upload/*';
export interface Capability {
    with: string;
    can: CanType;
    [constrain: string]: unknown;
}
export interface UcanHeader {
    alg: string;
    typ: string;
    ucv: string;
}
export interface UcanPayload<Prf = string> {
    iss: string;
    aud: string;
    exp: number;
    nbf?: number;
    nnc?: string;
    att: Capability[];
    fct?: Fact[];
    prf: Prf[];
}
export interface UcanParts<Prf = string> {
    header: UcanHeader;
    payload: UcanPayload<Prf>;
}
export interface Ucan<Prf = string> {
    header: UcanHeader;
    payload: UcanPayload<Prf>;
    signature: Uint8Array;
}
export interface UcanWithJWT extends Ucan {
    jwt: string;
}
export interface BuildParams {
    issuer: KeyPair;
    audience: string;
    capabilities: Capability[];
    lifetimeInSeconds?: number;
    expiration?: number;
    notBefore?: number;
    facts?: Fact[];
    proofs?: string[];
    addNonce?: boolean;
}
export interface BuildPayload extends Omit<BuildParams, 'issuer'> {
    issuer: string;
}
export interface SignedUCAN<Prf = string> {
    header: UcanHeader;
    payload: UcanPayload<Prf>;
    signature: string;
    jwt: string;
}
export interface ValidateOptions {
    checkIssuer?: boolean;
    checkIsExpired?: boolean;
    checkIsTooEarly?: boolean;
    checkSignature?: boolean;
}
export interface ValidateResult {
    header: UcanHeader;
    payload: UcanPayload<string>;
    signature: Uint8Array;
}
export interface CapabilitySemantics<A> {
    tryParsing: (cap: Capability) => A | CapabilityParseError;
    tryDelegating: (parentCap: A, childCap: A) => A | CapabilityUnrelatedError<A> | CapabilityEscalationError<A>;
}
export interface StorageSemantics extends Capability {
    with: string;
    can: CanType;
    mh?: string;
}
export type StorageCapability = UploadAll | UploadImport;
export interface UploadAll extends Capability {
    with: string;
    can: 'upload/*';
}
export interface UploadImport extends Capability {
    with: string;
    can: 'upload/IMPORT';
    mh?: string;
}
export interface UcanStorageOptions extends Omit<BuildParams, 'capabilities'> {
    capabilities: StorageCapability[];
}
//# sourceMappingURL=types.d.ts.map