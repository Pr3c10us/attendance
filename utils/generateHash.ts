export default async function GenerateHash(input: string): Promise<string> {
    // Convert the string to Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    // Generate the hash using Web Crypto API
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert buffer to byte array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // Convert bytes to hex string
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    return '0x' + hashHex;
}