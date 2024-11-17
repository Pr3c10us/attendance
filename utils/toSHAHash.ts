import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils';

/**
 * Converts a string to its SHA3 (Keccak-256) hash
 * @param input The string to hash
 * @returns The hash as a lowercase hex string with '0x' prefix
 */
function ToSha3Hash(input: string): string {
    // Convert string to Uint8Array of UTF-8 bytes
    const bytes = utf8ToBytes(input);

    // Generate keccak-256 hash
    const hashBytes = keccak256(bytes);

    // Convert hash bytes to hex string
    const hashHex = Buffer.from(hashBytes).toString('hex');

    // Return with 0x prefix
    return `0x${hashHex}`;
}

export default ToSha3Hash;