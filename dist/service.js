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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
    static fromPrivateKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const kp = yield keypair_1.KeyPair.fromExportedKey(key);
            return new Service(kp);
        });
    }
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Service(yield keypair_1.KeyPair.create());
        });
    }
    validate(encodedUcan, capability) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield ucan_chain_1.UcanChain.fromToken(encodedUcan, {});
            if (token.audience() !== this.did()) {
                throw new Error('Invalid UCAN: Audience does not match this service.');
            }
            const origin = token.claim(capability, semantics_1.storageSemantics);
            if (origin.issuer() !== this.did()) {
                throw new Error('Invalid UCAN: Root issuer does not match this service.');
            }
            return origin;
        });
    }
    validateFromCaps(encodedUcan) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield ucan_chain_1.UcanChain.fromToken(encodedUcan, {});
            if (token.audience() !== this.did()) {
                throw new Error('Invalid UCAN: Audience does not match this service.');
            }
            const caps = token.caps(semantics_1.storageSemantics);
            if (caps[0].root.issuer() !== this.did()) {
                throw new Error('Invalid UCAN: Root issuer does not match this service.');
            }
            return Object.assign(Object.assign({}, caps[0]), { issuer: token.issuer() });
        });
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
    refresh(encodedUcan, did) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield ucan_chain_1.UcanChain.fromToken(encodedUcan, {});
            if (token.issuer() !== did) {
                throw new Error('Issuer does not match this user in service.');
            }
            yield this.validate(encodedUcan, {
                with: `storage://${did}`,
                can: 'upload/*',
            });
            return this.ucan(did);
        });
    }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map