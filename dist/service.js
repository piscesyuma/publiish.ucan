"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const ucan = __importStar(require("./ucan-storage"));
const ucan_chain_1 = require("./ucan-chain");
const keypair_1 = require("./keypair");
const semantics_1 = require("./semantics");
class Service {
    constructor(keypair) {
        this.keypair = keypair;
    }
    static async fromPrivateKey(key) {
        const kp = await keypair_1.KeyPair.fromExportedKey(key);
        return new Service(kp);
    }
    static async create() {
        return new Service(await keypair_1.KeyPair.create());
    }
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
    ucan(did) {
        const ttl = 1209600;
        return ucan.build({
            issuer: this.keypair,
            audience: did,
            capabilities: [{ with: `storage://${did}`, can: 'upload/*' }],
            lifetimeInSeconds: ttl,
        });
    }
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
//# sourceMappingURL=service.js.map