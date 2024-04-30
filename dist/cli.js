#!/usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sade_1 = __importDefault(require("sade"));
const keypair_1 = require("./keypair");
const Ucan = __importStar(require("./ucan-storage"));
const prog = (0, sade_1.default)('ucan-storage');
prog
    .command('keypair')
    .describe('Create a keypair.')
    .option('--from', 'Output keypair from exported private key.')
    .action(async (opts) => {
    try {
        const kp = await (opts.from
            ? keypair_1.KeyPair.fromExportedKey(opts.from)
            : keypair_1.KeyPair.create());
        console.log(`DID:           ${kp.did()}`);
        console.log(`Public Key:    ${kp.publicKeyStr()}`);
        console.log(`Private Key:   ${kp.export()}`);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
prog
    .command('ucan', 'Create a ucan.')
    .option('--issuer')
    .option('--audience', 'Audience DID')
    .option('--expiration', 'Expiration date in ISO 8601 format.')
    .option('--with', 'Resource pointer.')
    .option('--can', 'Allowed action on the resource.')
    .option('--proof', 'Add proofs to the ucan.')
    .action(async (opts) => {
    try {
        const kp = await (opts.issuer
            ? keypair_1.KeyPair.fromExportedKey(opts.issuer)
            : keypair_1.KeyPair.create());
        const milliseconds = Date.parse(opts.expiration ?? '');
        const cap = {
            with: `storage://${kp.did()}`,
            can: 'upload/*',
        };
        const proofs = Array.isArray(opts.proof) ? opts.proof : [opts.proof ?? ''];
        const ucan = await Ucan.build({
            issuer: kp,
            audience: opts.audience ?? '',
            expiration: Math.floor(milliseconds / 1000),
            capabilities: [
                {
                    with: opts.with || cap.with,
                    can: opts.can || cap.can,
                },
            ],
            proofs: [...proofs],
        });
        const validated = await Ucan.validate(ucan);
        console.log(JSON.stringify(validated.payload, undefined, 2));
        console.log(`UCAN:\n${ucan}`);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
prog
    .command('validate <ucan>', 'Validate a ucan.')
    .action(async (ucan, opts) => {
    try {
        const { payload } = await Ucan.validate(ucan);
        console.log(`Issuer: ${payload.iss}`);
        console.log(`Audience: ${payload.aud}`);
        console.log(`Expires: ${new Date(payload.exp * 1000).toISOString()}`);
        console.log(`Capabilities: ${JSON.stringify(payload.att, undefined, 2)}`);
        console.log(`Proofs: ${JSON.stringify(payload.prf, undefined, 2)}`);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
prog.parse(process.argv);
//# sourceMappingURL=cli.js.map