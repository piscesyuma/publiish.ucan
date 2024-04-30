"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUcan = exports.validate = exports.build = void 0;
const tslib_1 = require("tslib");
const Ucan = tslib_1.__importStar(require("./ucan"));
const semantics_1 = require("./semantics");
/**
 * Construct and sign a new UCAN token with the given {@link UcanStorageOptions}.
 * The UCAN is specific to the Storage services and semantics.
 *
 * @param {import('./types').UcanStorageOptions} params
 * @returns {Promise<string>} a Promise that resolves to the encoded JWT representation of the signed UCAN token.
 */
async function build(params) {
    const { capabilities } = params;
    for (const cap of capabilities) {
        const parsed = semantics_1.storageSemantics.tryParsing(cap);
        if (parsed instanceof Error) {
            throw parsed;
        }
    }
    const { jwt } = await Ucan.build(params);
    return jwt;
}
exports.build = build;
/**
 * Validate the given encoded UCAN token and return the parsed instance.
 *
 * **Note** This doesn't validate it's a valid UCAN chain but rather a single ucan is,
 * disregarding the proof chain.
 *
 * You may optionally skip parts of the validation process by passing in {@link ValidateOptions}. By default,
 * all validation checks are performed.
 *
 * If the token is valid, returns a {@link ValidateResult} containing the parsed
 * {@link UcanHeader} and {@link UcanPayload}, as well as the signature `Uint8Array`.
 *
 * @param {string} jwt - a UCAN token, encoded as a JWT string
 * @param {import('./types').ValidateOptions} [options] - flags to optionally skip portions of the validation process. If not set, all flags default to `true`, meaning checks will be performed.
 * @returns {Promise<import('./types').ValidateResult>} a Promise that resolves to a {@link ValidateResult} if the token is valid, or rejects with an `Error` if validation fails.
 */
function validate(jwt, options) {
    return Ucan.validate(jwt, options);
}
exports.validate = validate;
var ucan_1 = require("./ucan");
Object.defineProperty(exports, "isUcan", { enumerable: true, get: function () { return ucan_1.isUcan; } });
