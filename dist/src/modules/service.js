"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const tslib_1 = require("tslib");
const ucan = tslib_1.__importStar(require("./ucan-storage"));
const ucan_chain_1 = require("./ucan-chain");
const keypair_1 = require("./keypair");
const semantics_1 = require("./semantics");
class Service {
    /**
     * @param {KeyPair} keypair
     */
    constructor(keypair) {
        this.keypair = keypair;
    }
    /**
     * @param {string} key
     */
    static async fromPrivateKey(key) {
        const kp = await keypair_1.KeyPair.fromExportedKey(key);
        return new Service(kp);
    }
    static async create() {
        return new Service(await keypair_1.KeyPair.create());
    }
    /**
     * Validates UCAN for capability
     *
     * @param {string} encodedUcan
     * @param {import('./types.js').Capability} capability
     * @returns {Promise<UcanChain>} Returns the root ucan for capability
     */
    async validate(encodedUcan, capability) {
        const token = await ucan_chain_1.UcanChain.fromToken(encodedUcan, {});
        if (token.audience() !== this.did()) {
            throw new Error('Invalid UCAN: Audience does not match this service.');
        }
        const origin = token.claim(capability, semantics_1.storageSemantics);
        if (origin.issuer() !== this.did()) {
            throw new Error('Invalid UCAN: Root issuer does not match this service.');
        }
        return origin;
    }
    /**
     * It checks the full validity of the chain, that root issuer and target audience is the service did.
     *
     * @param {string} encodedUcan
     */
    async validateFromCaps(encodedUcan) {
        const token = await ucan_chain_1.UcanChain.fromToken(encodedUcan, {});
        if (token.audience() !== this.did()) {
            throw new Error('Invalid UCAN: Audience does not match this service.');
        }
        const caps = token.caps(semantics_1.storageSemantics);
        if (caps[0].root.issuer() !== this.did()) {
            throw new Error('Invalid UCAN: Root issuer does not match this service.');
        }
        return { ...caps[0], issuer: token.issuer() };
    }
    did() {
        return this.keypair.did();
    }
    /**
     * @param {string} did
     */
    ucan(did) {
        const ttl = 1_209_600; // 2 weeks
        return ucan.build({
            issuer: this.keypair,
            audience: did,
            capabilities: [{ with: `storage://${did}`, can: 'upload/*' }],
            lifetimeInSeconds: ttl,
        });
    }
    /**
     * @param {string} encodedUcan
     * @param {string} did
     */
    async refresh(encodedUcan, did) {
        const token = await ucan_chain_1.UcanChain.fromToken(encodedUcan, {});
        if (token.issuer() !== did) {
            throw new Error('Issuer does not match this user in service.');
        }
        await this.validate(encodedUcan, {
            with: `storage://${did}`,
            can: 'upload/*',
        });
        return this.ucan(did);
    }
}
exports.Service = Service;
