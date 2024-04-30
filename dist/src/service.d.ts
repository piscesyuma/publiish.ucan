import { UcanChain } from './ucan-chain';
import { KeyPair } from './keypair';
import { Capability } from './types';
export declare class Service {
    keypair: KeyPair;
    constructor(keypair: KeyPair);
    static fromPrivateKey(key: string): Promise<Service>;
    static create(): Promise<Service>;
    validate(encodedUcan: string, capability: Capability): Promise<UcanChain>;
    validateFromCaps(encodedUcan: string): Promise<{
        issuer: string;
        root: UcanChain;
        cap: import("./types").StorageSemantics;
    }>;
    did(): string;
    ucan(did: string): Promise<string>;
    refresh(encodedUcan: string, did: string): Promise<string>;
}
//# sourceMappingURL=service.d.ts.map