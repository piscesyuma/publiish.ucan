import { concatUint8, equals } from './utils'
import * as ed from '@noble/ed25519'
import { base58btc, utf8 } from './encoding'
import { KeyType } from './types'

export const BASE58_DID_PREFIX = 'did:key:z' // z is the multibase prefix for base58btc byte encoding
/** https://github.com/multiformats/multicodec/blob/e9ecf587558964715054a0afcc01f7ace220952c/table.csv#L94 */
export const EDWARDS_DID_PREFIX = new Uint8Array([0xed, 0x01])

/**
 * Convert a public key in bytes to a DID (did:key).
 *
 * @param {Uint8Array} publicKeyBytes
 */
export function publicKeyBytesToDid(publicKeyBytes: Uint8Array) {
  const prefixedBytes = concatUint8([EDWARDS_DID_PREFIX, publicKeyBytes])

  // Encode prefixed
  return BASE58_DID_PREFIX + base58btc.encode(prefixedBytes)
}

/**
 * Parse supported did:key types
 *
 * @param {string} did
 */
export function parse(did: string) {
  if (!(typeof did === 'string')) {
    throw new TypeError('did must be a string')
  }
  if (!did.startsWith(BASE58_DID_PREFIX)) {
    throw new Error('Please use a base58-encoded DID formatted `did:key:z...`')
  }
  const didWithoutPrefix = did.slice(BASE58_DID_PREFIX.length)
  const magicBytes = base58btc.decode(didWithoutPrefix)
  const keyAndType = parseMagicBytes(magicBytes)

  return {
    prefix: BASE58_DID_PREFIX,
    publicKey: keyAndType.keyBytes,
    type: keyAndType.type,
  }
}

/**
 * Convert DID to public in bytes
 *
 * @param {string} did
 */
export function didToPublicKeyBytes(did: string) {
  const parsed = parse(did)

  return parsed.publicKey
}

/**
 * Get did key type
 *
 * @param {string} did
 */
export function didKeyType(did: string) {
  const parsed = parse(did)

  return parsed.type
}

/**
 * @param {Uint8Array} key
 * @returns {{keyBytes: Uint8Array, type: import('./types.js').KeyType}}
 */
export function parseMagicBytes(key: Uint8Array) {
  if (hasPrefix(key, EDWARDS_DID_PREFIX)) {
    return {
      keyBytes: key.slice(EDWARDS_DID_PREFIX.byteLength),
      type: 'ed25519' as KeyType,
    }
  }

  throw new Error('Unsupported key algorithm. Try using ed25519.')
}

/**
 * Determines if a Uint8Array has a given indeterminate length-prefix.
 *
 * @param {Uint8Array} prefixedKey
 * @param {Uint8Array} prefix
 */
export function hasPrefix(prefixedKey: Uint8Array, prefix: Uint8Array) {
  return equals(prefix, prefixedKey.subarray(0, prefix.byteLength))
}

/**
 * @param {string } data
 * @param {Uint8Array} signature
 * @param {string} did
 */
export function verify(data: string, signature: Uint8Array, did: string) {
  return ed.verify(signature, utf8.decode(data), didToPublicKeyBytes(did))
}
