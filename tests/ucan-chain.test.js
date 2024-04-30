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
const uvu_1 = require("uvu");
const assert = __importStar(require("uvu/assert"));
const Ucan = __importStar(require("../src/ucan"));
const ucan_chain_1 = require("../src/ucan-chain");
const semantics_1 = require("../src/semantics");
(0, uvu_1.test)('verify single ucan', async () => {
    const kp1 = await Ucan.KeyPair.create();
    const kp2 = await Ucan.KeyPair.create();
    const token = await Ucan.build({
        issuer: kp1,
        audience: kp2.did(),
        lifetimeInSeconds: 1000,
        capabilities: [
            {
                with: `storage://${kp2.did()}`,
                can: 'upload/*',
            },
        ],
    });
    const verifiedToken = await ucan_chain_1.UcanChain.fromToken(token.jwt);
    assert.is(verifiedToken.audience(), kp2.did());
    assert.is(verifiedToken.issuer(), kp1.did());
});
(0, uvu_1.test)('verify delegated ucan', async () => {
    const kp1 = await Ucan.KeyPair.create();
    const kp2 = await Ucan.KeyPair.create();
    const kp3 = await Ucan.KeyPair.create();
    const token1 = await Ucan.build({
        issuer: kp1,
        audience: kp2.did(),
        lifetimeInSeconds: 1000,
        capabilities: [
            {
                with: `storage://${kp2.did()}`,
                can: 'upload/*',
            },
        ],
    });
    const token2 = await Ucan.build({
        issuer: kp2,
        audience: kp3.did(),
        lifetimeInSeconds: 1000,
        capabilities: [
            {
                with: `storage://${kp2.did()}`,
                can: 'upload/*',
            },
        ],
        proofs: [token1.jwt],
    });
    const verifiedToken = await ucan_chain_1.UcanChain.fromToken(token2.jwt);
    assert.is(verifiedToken.audience(), kp3.did());
    assert.is(verifiedToken.issuer(), kp2.did());
    const proofs = verifiedToken.proofs();
    assert.is(proofs[0].audience(), kp2.did());
    assert.is(proofs[0].issuer(), kp1.did());
});
(0, uvu_1.test)('should fail with unmatched from/to', async () => {
    const kp1 = await Ucan.KeyPair.create();
    const kp2 = await Ucan.KeyPair.create();
    const kp3 = await Ucan.KeyPair.create();
    const token1 = await Ucan.build({
        issuer: kp1,
        audience: kp2.did(),
        lifetimeInSeconds: 1000,
        capabilities: [
            {
                with: `storage://${kp2.did()}`,
                can: 'upload/*',
            },
        ],
    });
    const token2 = await Ucan.build({
        issuer: kp1,
        audience: kp3.did(),
        lifetimeInSeconds: 1000,
        capabilities: [
            {
                with: `storage://${kp2.did()}`,
                can: 'upload/*',
            },
        ],
        proofs: [token1.jwt],
    });
    try {
        await ucan_chain_1.UcanChain.fromToken(token2.jwt);
        assert.unreachable('should have thrown');
    }
    catch (error) {
        assert.instance(error, Error);
        assert.match(error.message, 'Invalid UCAN: Audience');
    }
});
(0, uvu_1.test)('should fail with unmatched from/to deep in the chain', async () => {
    const kp1 = await Ucan.KeyPair.create();
    const kp2 = await Ucan.KeyPair.create();
    const kp3 = await Ucan.KeyPair.create();
    const kp4 = await Ucan.KeyPair.create();
    const kp5 = await Ucan.KeyPair.create();
    const token1 = await Ucan.build({
        issuer: kp1,
        audience: kp2.did(),
        lifetimeInSeconds: 1000,
        capabilities: [
            {
                with: `storage://${kp2.did()}`,
                can: 'upload/*',
            },
        ],
    });
    const token2 = await Ucan.build({
        issuer: kp3,
        audience: kp4.did(),
        lifetimeInSeconds: 1000,
        capabilities: [
            {
                with: `storage://${kp4.did()}`,
                can: 'upload/*',
            },
        ],
        proofs: [token1.jwt],
    });
    const token3 = await Ucan.build({
        issuer: kp4,
        audience: kp5.did(),
        lifetimeInSeconds: 1000,
        capabilities: [
            {
                with: `storage://${kp5.did()}`,
                can: 'upload/*',
            },
        ],
        proofs: [token2.jwt],
    });
    try {
        await ucan_chain_1.UcanChain.fromToken(token3.jwt);
        assert.unreachable('should have thrown');
    }
    catch (error) {
        assert.instance(error, Error);
        assert.match(error.message, 'Invalid UCAN: Audience');
    }
});
(0, uvu_1.test)('should fail claim with bad capability', async () => {
    const kp1 = await Ucan.KeyPair.create();
    const kp2 = await Ucan.KeyPair.create();
    const kp3 = await Ucan.KeyPair.create();
    const token1 = await Ucan.build({
        issuer: kp1,
        audience: kp2.did(),
        capabilities: [
            {
                with: `storage://user1`,
                can: 'upload/*',
            },
        ],
    });
    const token2 = await Ucan.build({
        issuer: kp2,
        audience: kp3.did(),
        capabilities: [
            {
                with: 'prf:*',
            },
        ],
        proofs: [token1.jwt],
    });
    const ucan = await ucan_chain_1.UcanChain.fromToken(token2.jwt);
    assert.throws(() => {
        ucan.claim({ with: `storage://Special` }, semantics_1.storageSemantics);
    }, /"can" must be a string./);
});
(0, uvu_1.test)('should fail claim with wrong resource', async () => {
    const kp1 = await Ucan.KeyPair.create();
    const kp2 = await Ucan.KeyPair.create();
    const kp3 = await Ucan.KeyPair.create();
    const token1 = await Ucan.build({
        issuer: kp1,
        audience: kp2.did(),
        capabilities: [
            {
                with: `storage://user1`,
                can: 'upload/*',
            },
        ],
    });
    const token2 = await Ucan.build({
        issuer: kp2,
        audience: kp3.did(),
        capabilities: [
            {
                with: 'prf:*',
            },
        ],
        proofs: [token1.jwt],
    });
    const ucan = await ucan_chain_1.UcanChain.fromToken(token2.jwt);
    assert.throws(() => {
        ucan.claim({ with: `storage://user2`, can: 'upload/*' }, semantics_1.storageSemantics);
    }, /Child resource does not match parent resource/);
});
(0, uvu_1.test)('should claim with prf:*', async () => {
    const kp1 = await Ucan.KeyPair.create();
    const kp2 = await Ucan.KeyPair.create();
    const kp3 = await Ucan.KeyPair.create();
    const token1 = await Ucan.build({
        issuer: kp1,
        audience: kp2.did(),
        capabilities: [
            {
                with: `storage://user1`,
                can: 'upload/*',
            },
        ],
    });
    const token2 = await Ucan.build({
        issuer: kp2,
        audience: kp3.did(),
        capabilities: [
            {
                with: 'prf:*',
            },
        ],
        proofs: [token1.jwt],
    });
    const ucan = await ucan_chain_1.UcanChain.fromToken(token2.jwt);
    const r = ucan.claim({ with: `storage://user1`, can: 'upload/*' }, semantics_1.storageSemantics);
    assert.is(r.issuer(), kp1.did());
    assert.is(r.audience(), kp2.did());
});
(0, uvu_1.test)('should claim with prf:0', async () => {
    const kp1 = await Ucan.KeyPair.create();
    const kp2 = await Ucan.KeyPair.create();
    const kp3 = await Ucan.KeyPair.create();
    const token1 = await Ucan.build({
        issuer: kp1,
        audience: kp2.did(),
        capabilities: [
            {
                with: `storage://user1`,
                can: 'upload/*',
            },
        ],
    });
    const token2 = await Ucan.build({
        issuer: kp2,
        audience: kp3.did(),
        capabilities: [
            {
                with: 'prf:0',
            },
        ],
        proofs: [token1.jwt],
    });
    const ucan = await ucan_chain_1.UcanChain.fromToken(token2.jwt);
    const r = ucan.claim({ with: `storage://user1`, can: 'upload/*' }, semantics_1.storageSemantics);
    assert.is(r.issuer(), kp1.did());
    assert.is(r.audience(), kp2.did());
});
(0, uvu_1.test)('should claim with prf:1 with multiple proofs', async () => {
    const kp1 = await Ucan.KeyPair.create();
    const kp2 = await Ucan.KeyPair.create();
    const kp3 = await Ucan.KeyPair.create();
    const token1 = await Ucan.build({
        issuer: kp1,
        audience: kp2.did(),
        capabilities: [
            {
                with: `storage://user1`,
                can: 'upload/*',
            },
        ],
    });
    const token2 = await Ucan.build({
        issuer: kp3,
        audience: kp2.did(),
        capabilities: [
            {
                with: `storage://special`,
                can: 'upload/IMPORT',
            },
        ],
    });
    const tokenFinal = await Ucan.build({
        issuer: kp2,
        audience: kp1.did(),
        capabilities: [
            {
                with: 'prf:1',
            },
        ],
        proofs: [token1.jwt, token2.jwt],
    });
    const ucan = await ucan_chain_1.UcanChain.fromToken(tokenFinal.jwt);
    const r = ucan.claim({ with: `storage://special`, can: 'upload/IMPORT' }, semantics_1.storageSemantics);
    assert.is(r.issuer(), kp3.did());
    assert.is(r.audience(), kp2.did());
});
(0, uvu_1.test)('should claim with extended resource path', async () => {
    const kp1 = await Ucan.KeyPair.create();
    const kp2 = await Ucan.KeyPair.create();
    const kp3 = await Ucan.KeyPair.create();
    const token1 = await Ucan.build({
        issuer: kp1,
        audience: kp2.did(),
        capabilities: [
            {
                with: `storage://user1`,
                can: 'upload/*',
            },
        ],
    });
    const token2 = await Ucan.build({
        issuer: kp2,
        audience: kp3.did(),
        capabilities: [
            {
                with: `storage://user1/user2`,
                can: 'upload/IMPORT',
            },
        ],
        proofs: [token1.jwt],
    });
    const tokenFinal = await Ucan.build({
        issuer: kp3,
        audience: kp1.did(),
        capabilities: [
            {
                with: `storage://user1/user2/public`,
                can: 'upload/IMPORT',
            },
        ],
        proofs: [token2.jwt],
    });
    const ucan = await ucan_chain_1.UcanChain.fromToken(tokenFinal.jwt);
    const r = ucan.claim({ with: `storage://user1/user2/public`, can: 'upload/IMPORT' }, semantics_1.storageSemantics);
    assert.is(r.issuer(), kp1.did());
    assert.is(r.audience(), kp2.did());
});
// not supported yet
uvu_1.test.skip('should claim with multiple delegation with prf:*', async () => {
    const kp1 = await Ucan.KeyPair.create();
    const kp2 = await Ucan.KeyPair.create();
    const kp3 = await Ucan.KeyPair.create();
    const token1 = await Ucan.build({
        issuer: kp1,
        audience: kp2.did(),
        capabilities: [
            {
                with: `storage://user1`,
                can: 'upload/*',
            },
        ],
    });
    const token2 = await Ucan.build({
        issuer: kp2,
        audience: kp3.did(),
        capabilities: [
            {
                with: `prf:*`,
            },
        ],
        proofs: [token1.jwt],
    });
    const tokenFinal = await Ucan.build({
        issuer: kp3,
        audience: kp1.did(),
        capabilities: [
            {
                with: `prf:*`,
            },
        ],
        proofs: [token2.jwt],
    });
    const ucan = await ucan_chain_1.UcanChain.fromToken(tokenFinal.jwt);
    const r = ucan.claim({ with: `storage://user1`, can: 'upload/IMPORT' }, semantics_1.storageSemantics);
    assert.is(r.issuer(), kp1.did());
    assert.is(r.audience(), kp2.did());
});
uvu_1.test.run();
//# sourceMappingURL=ucan-chain.test.js.map