"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUcan = exports.validate = exports.sign = exports.build = void 0;
const did_1 = require("./did");
const encoding_1 = require("./encoding");
const utils_1 = require("./utils");
const TYPE = 'JWT';
const VERSION = '0.8.0';
async function build(params) {
    const keypair = params.issuer;
    const didStr = (0, did_1.publicKeyBytesToDid)(keypair.publicKey);
    const payload = buildPayload({
        ...params,
        issuer: didStr,
    });
    return sign(payload, keypair);
}
exports.build = build;
function buildPayload(params) {
    const { issuer, audience, capabilities = [], lifetimeInSeconds = 30, expiration, notBefore, facts, proofs = [], } = params;
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const exp = expiration || currentTimeInSeconds + lifetimeInSeconds;
    const payload = {
        aud: audience,
        att: capabilities,
        exp,
        fct: facts,
        iss: issuer,
        nbf: notBefore,
        prf: proofs,
    };
    return payload;
}
async function sign(payload, keypair) {
    const header = {
        alg: 'EdDSA',
        typ: TYPE,
        ucv: VERSION,
    };
    const encodedHeader = (0, utils_1.serialize)(header);
    const encodedPayload = (0, utils_1.serialize)(payload);
    const toSign = `${encodedHeader}.${encodedPayload}`;
    const sig = await keypair.sign(encoding_1.utf8.decode(toSign));
    const encodedSig = encoding_1.base64url.encode(sig);
    return {
        header,
        payload,
        signature: sig,
        jwt: encodedHeader + '.' + encodedPayload + '.' + encodedSig,
    };
}
exports.sign = sign;
async function validate(encodedUcan, options = {}) {
    const opts = {
        checkIssuer: true,
        checkIsExpired: true,
        checkIsTooEarly: true,
        checkSignature: true,
        ...options,
    };
    const [encodedHeader, encodedPayload, encodedSignature] = encodedUcan.split('.');
    if (encodedHeader === undefined ||
        encodedPayload === undefined ||
        encodedSignature === undefined) {
        throw new Error(`Can't parse UCAN: ${encodedUcan}: Expected JWT format: 3 dot-separated base64url-encoded values.`);
    }
    const header = (0, utils_1.deserialize)(encodedHeader);
    const payload = (0, utils_1.deserialize)(encodedPayload);
    const signature = encoding_1.base64url.decode(encodedSignature);
    if (opts.checkIssuer) {
        const issuerKeyType = (0, did_1.didKeyType)(payload.iss);
        if ((0, utils_1.jwtAlgorithm)(issuerKeyType) !== header.alg) {
            throw new Error(`Invalid UCAN: ${encodedUcan}: Issuer key type does not match UCAN's alg property.`);
        }
    }
    if (opts.checkSignature &&
        !(await (0, did_1.verify)(`${encodedHeader}.${encodedPayload}`, signature, payload.iss))) {
        throw new Error(`Invalid UCAN: ${encodedUcan}: Signature invalid.`);
    }
    if (opts.checkIsExpired && (0, utils_1.isExpired)(payload)) {
        throw new Error(`Invalid UCAN: ${encodedUcan}: Expired.`);
    }
    if (opts.checkIsTooEarly && (0, utils_1.isTooEarly)(payload)) {
        throw new Error(`Invalid UCAN: ${encodedUcan}: Not active yet (too early).`);
    }
    return { header, payload, signature };
}
exports.validate = validate;
function isUcan(encodedUcan) {
    const [encodedHeader, encodedPayload, encodedSignature] = encodedUcan.split('.');
    if (encodedHeader === undefined ||
        encodedPayload === undefined ||
        encodedSignature === undefined) {
        return false;
    }
    const header = (0, utils_1.deserialize)(encodedHeader);
    if (typeof header.ucv === 'string') {
        return true;
    }
    return false;
}
exports.isUcan = isUcan;
//# sourceMappingURL=ucan.js.map