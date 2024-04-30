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
exports.UcanChain = exports.findValidCaps = void 0;
const ucan = __importStar(require("./ucan"));
/**
 * @template A
 * @param {import('./types').CapabilitySemantics<A>} semantics
 * @param {UcanChain} ucan
 */
function* findValidCaps(semantics, ucan) {
    const caps = ucan.capabilities();
    const parentCaps = [];
    for (const cap of caps) {
        if (cap.with.startsWith('prf:')) {
            const proofs = ucan.proofs();
            const [, index] = cap.with.split(':');
            const parsedIndex = Number.parseInt(index);
            if (index === '*') {
                for (const proof of proofs) {
                    parentCaps.push(...proof.capabilities());
                }
            }
            if (Number.isInteger(parsedIndex)) {
                parentCaps.push(...proofs[parsedIndex].capabilities());
            }
        }
        const parsed = semantics.tryParsing(cap);
        if (!(parsed instanceof Error)) {
            yield parsed;
        }
    }
    for (const parentCap of parentCaps) {
        const parsed = semantics.tryParsing(parentCap);
        if (!(parsed instanceof Error)) {
            yield parsed;
        }
    }
}
exports.findValidCaps = findValidCaps;
/**
 * Can ucan delegate capability with semantics
 *
 * @template A
 * @param {UcanChain} ucan
 * @param {A} capParsed
 * @param {import('./types').CapabilitySemantics<A>} semantics
 */
function canDelegate(ucan, capParsed, semantics) {
    const ucanCapsParsed = findValidCaps(semantics, ucan);
    let escalation;
    for (const ucanCapParsed of ucanCapsParsed) {
        const result = semantics.tryDelegating(ucanCapParsed, capParsed);
        if (result instanceof Error) {
            escalation = result;
        }
        else if (result !== null) {
            return { value: ucanCapParsed };
        }
    }
    return {
        error: escalation || new Error('Not found.'),
    };
}
/**
 * Find root ucan for capability with semantics
 *
 * @template A
 * @param {UcanChain} ucan
 * @param {A} capParsed
 * @param {import('./types').CapabilitySemantics<A>} semantics
 * @returns {UcanChain}
 */
function findRoot(ucan, capParsed, semantics) {
    const proofs = ucan.proofs();
    if (proofs.length === 0) {
        return ucan;
    }
    else {
        let lastError;
        for (const parent of proofs) {
            const { value, error } = canDelegate(parent, capParsed, semantics);
            if (value) {
                return findRoot(parent, value, semantics);
            }
            else {
                lastError = error;
            }
        }
        throw lastError;
    }
}
/**
 * Represents a UCAN chain with all the proofs parsed into UCAN chains too.
 * - Validates each ucan
 * - Parses all the proofs in a UCAN chain
 * - Validate parent audience matches child issuer
 */
class UcanChain {
    /**
     * @param {string} encoded
     * @param {import('./types').Ucan<UcanChain>} decoded
     */
    constructor(encoded, decoded) {
        this._encoded = encoded;
        this._decoded = decoded;
    }
    /**
     * Create an instance of UcanChain from a ucan jwt token
     *
     * @param {string} encodedUcan
     * @param {import('./types').ValidateOptions} [options]
     * @returns {Promise<UcanChain>}
     */
    static async fromToken(encodedUcan, options) {
        const token = await ucan.validate(encodedUcan, options);
        // parse proofs recursively
        const proofs = await Promise.all(token.payload.prf.map((encodedPrf) => UcanChain.fromToken(encodedPrf, options)));
        // check sender/receiver matchups. A parent ucan's audience must match the child ucan's issuer
        const incorrectProof = proofs.find((proof) => proof.audience() !== token.payload.iss);
        if (incorrectProof) {
            throw new Error(`Invalid UCAN: Audience ${incorrectProof.audience()} doesn't match issuer ${token.payload.iss}`);
        }
        const ucanTransformed = {
            ...token,
            payload: {
                ...token.payload,
                prf: proofs,
            },
        };
        return new UcanChain(encodedUcan, ucanTransformed);
    }
    /**
     * Get valid capabilities for the semantics
     *
     * @template A
     * @param {import('./types').CapabilitySemantics<A>} semantics
     */
    caps(semantics) {
        const validCaps = [];
        for (const cap of findValidCaps(semantics, this)) {
            try {
                const root = findRoot(this, cap, semantics);
                validCaps.push({ root, cap });
            }
            catch { }
        }
        return validCaps;
    }
    /**
     * @template A
     * @param {import('./types').Capability} cap
     * @param {import('./types').CapabilitySemantics<A>} semantics
     */
    claim(cap, semantics) {
        const capParsed = semantics.tryParsing(cap);
        if (capParsed instanceof Error) {
            throw capParsed;
        }
        const { value, error } = canDelegate(this, capParsed, semantics);
        if (value) {
            return findRoot(this, value, semantics);
        }
        else {
            throw error;
        }
    }
    proofs() {
        return this._decoded.payload.prf;
    }
    audience() {
        return this._decoded.payload.aud;
    }
    issuer() {
        return this._decoded.payload.iss;
    }
    /**
     * The payload the top level represented by this Chain element.
     * Its proofs are omitted. To access proofs, use `.proofs()`
     *
     * @returns {import('./types').Ucan<never>}
     */
    payload() {
        return {
            ...this._decoded,
            payload: {
                ...this._decoded.payload,
                prf: [],
            },
        };
    }
    capabilities() {
        return this._decoded.payload.att;
    }
}
exports.UcanChain = UcanChain;
//# sourceMappingURL=ucan-chain.js.map