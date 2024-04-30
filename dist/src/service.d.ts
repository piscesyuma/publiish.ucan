import { UcanChain } from './ucan-chain';
import { KeyPair } from './keypair';
import { Capability } from './types';
export declare class Service {
    keypair: KeyPair;
    /**
     * @param {KeyPair} keypair
     */
    constructor(keypair: KeyPair);
    /**
     * @param {string} key
     */
    static fromPrivateKey(key: string): Promise<Service>;
    static create(): Promise<Service>;
    /**
     * Validates UCAN for capability
     *
     * @param {string} encodedUcan
     * @param {import('./types.js').Capability} capability
     * @returns {Promise<UcanChain>} Returns the root ucan for capability
     */
    validate(encodedUcan: string, capability: Capability): Promise<UcanChain>;
    /**
     * It checks the full validity of the chain, that root issuer and target audience is the service did.
     *
     * @param {string} encodedUcan
     */
    validateFromCaps(encodedUcan: string): Promise<any>;
    did(): string;
    /**
     * @param {string} did
     */
    ucan(did: string): Promise<string>;
    /**
     * @param {string} encodedUcan
     * @param {string} did
     */
    refresh(encodedUcan: string, did: string): Promise<string>;
}
//# sourceMappingURL=service.d.ts.map