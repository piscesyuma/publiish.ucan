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
exports.isUcan = exports.validate = exports.build = void 0;
const Ucan = __importStar(require("./ucan"));
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
//# sourceMappingURL=ucan-storage.js.map