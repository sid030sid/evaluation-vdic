const crypto = require('crypto');

// Function to create a joint secret key based on each participant's private key and the public keys of all other participants
function createJointSecretKey(privateKey, publicKeys) {
    // Initialize the joint secret key
    let jointSecretKey = Buffer.alloc(32, 0);

    // Iterate through each public key
    publicKeys.forEach(publicKey => {
        // Concatenate the private key and public key
        const sharedSecret = crypto.diffieHellman({
            privateKey: privateKey,
            publicKey: publicKey
        }).derive();

        // XOR the shared secret with the joint secret key
        jointSecretKey = Buffer.from(
            jointSecretKey.map((byte, index) => byte ^ sharedSecret[index])
        );
    });

    // Return the joint secret key
    return jointSecretKey.toString('hex');
}

/*
// Example usage:
const privateKeyA = crypto.createECDH('secp256k1');
privateKeyA.generateKeys(); // Generate private and public key pair for participant A
const privateKeyB = crypto.createECDH('secp256k1');
privateKeyB.generateKeys(); // Generate private and public key pair for participant B
const privateKeyC = crypto.createECDH('secp256k1');
privateKeyC.generateKeys(); // Generate private and public key pair for participant C

const publicKeys = [
    privateKeyA.getPublicKey(),
    privateKeyB.getPublicKey(),
    privateKeyC.getPublicKey()
];

// Each participant calls the function with their private key and the public keys of all other participants
const jointSecretKeyA = createJointSecretKey(privateKeyA.getPrivateKey(), [publicKeys[1], publicKeys[2]]);
const jointSecretKeyB = createJointSecretKey(privateKeyB.getPrivateKey(), [publicKeys[0], publicKeys[2]]);
const jointSecretKeyC = createJointSecretKey(privateKeyC.getPrivateKey(), [publicKeys[0], publicKeys[1]]);

console.log("Joint Secret Key A:", jointSecretKeyA);
console.log("Joint Secret Key B:", jointSecretKeyB);
console.log("Joint Secret Key C:", jointSecretKeyC);
*/

// Example usage:
const privateKeyA = crypto.createECDH('secp256k1');
privateKeyA.generateKeys(); // Generate private and public key pair for participant A
const privateKeyB = crypto.createECDH('secp256k1');
privateKeyB.generateKeys(); // Generate private and public key pair for participant B
const privateKeyC = crypto.createECDH('secp256k1');
privateKeyC.generateKeys(); // Generate private and public key pair for participant C

const publicKeys = [
    privateKeyA.getPublicKey(),
    privateKeyB.getPublicKey(),
    privateKeyC.getPublicKey()
];

console.log("privateKey A:", privateKeyA.getPrivateKey())
console.log("publicKeys:", publicKeys)

// Each participant calls the function with their private key and the public keys of all participants
const jointSecretKeyA = createJointSecretKey(privateKeyA.getPrivateKey(), publicKeys);
const jointSecretKeyB = createJointSecretKey(privateKeyB.getPrivateKey(), publicKeys);
const jointSecretKeyC = createJointSecretKey(privateKeyC.getPrivateKey(), publicKeys);

console.log("Joint Secret Key A:", jointSecretKeyA);
console.log("Joint Secret Key B:", jointSecretKeyB);
console.log("Joint Secret Key C:", jointSecretKeyC);
