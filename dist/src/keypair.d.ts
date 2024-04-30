export declare class KeyPair {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
    pubStr: string | undefined;
    constructor(privateKey: Uint8Array, publicKey: Uint8Array);
    static create(): Promise<KeyPair>;
    static fromExportedKey(key: string): Promise<KeyPair>;
    publicKeyStr(): string;
    did(): string;
    sign(msg: Uint8Array): Promise<Uint8Array>;
    export(): string;
}
//# sourceMappingURL=keypair.d.ts.map