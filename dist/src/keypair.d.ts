/**
 * A private Ed25519 signing key and its corresponding public key.
 */
export declare class KeyPair {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
    pubStr: string | undefined;
    /**
     * Create a new KeyPair object from raw key byte buffers.
     *
     * See {@link create} for key generation, and {@link fromExportedKey} to load previously generated keys.
     *
     * @param {Uint8Array} privateKey - private key bytes
     * @param {Uint8Array} publicKey - public key bytes
     */
    constructor(privateKey: Uint8Array, publicKey: Uint8Array);
    /**
     * Generate a new KeyPair.
     *
     * @returns {Promise<KeyPair>} a Promise that resolves to the generated KeyPair
     */
    static create(): Promise<KeyPair>;
    /**
     * Create a KeyPair from exported private key (see {@link export}).
     *
     * @param {string} key - a private key, as encoded by {@link export}
     * @returns {Promise<KeyPair>} a Promise that resolves to the loaded KeyPair object
     */
    static fromExportedKey(key: string): Promise<KeyPair>;
    /**
     * Return the Base64 encoded public key
     *
     * @returns {string} the public key, as a base64 encoded string (padded).
     */
    publicKeyStr(): string;
    /**
     * Create did from public key
     *
     * @returns {string} the public key, encoded into a `did:key:` DID string.
     */
    did(): string;
    /**
     * Create a signature of `msg` using the private signing key.
     *
     * @param {Uint8Array} msg - a message to sign
     * @returns {Promise<Uint8Array>} a Promise that resolves to the signature (as a Uint8Array)
     */
    sign(msg: Uint8Array): Promise<Uint8Array>;
    /**
     * Export the private key (e.g. to save to disk). If saving to disk, MUST be stored securely!
     * See {@link fromExportedKey} for loading a KeyPair from an exported key.
     *
     * @returns {string} the encoded private key string
     */
    export(): string;
}
//# sourceMappingURL=keypair.d.ts.map