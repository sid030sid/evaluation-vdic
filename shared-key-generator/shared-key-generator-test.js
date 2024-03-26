/*const crypto = require('crypto');

// Function to create a joint secret key based on each participant's private key and the concatenated public keys of all other participants
function createJointSecretKey(privateKeyBuffer, publicKeys) {
    // Concatenate all public keys
    const concatenatedPublicKeys = publicKeys.join('');

    // Hash the concatenated public keys with the private key
    const hash = crypto.createHash('sha256');
    hash.update(concatenatedPublicKeys);
    hash.update(privateKeyBuffer);

    // Return the hashed joint secret key
    return hash.digest('hex');
}

// Example usage:
const privateKeyA = crypto.createECDH('secp256k1');
privateKeyA.generateKeys(); // Generate private and public key pair for participant A
const privateKeyB = crypto.createECDH('secp256k1');
privateKeyB.generateKeys(); // Generate private and public key pair for participant B
const privateKeyC = crypto.createECDH('secp256k1');
privateKeyC.generateKeys(); // Generate private and public key pair for participant C

const publicKeys = [
    privateKeyA.getPublicKey('hex'),
    privateKeyB.getPublicKey('hex'),
    privateKeyC.getPublicKey('hex')
];

// Each participant calls the function with their private key and the public keys of all other participants
const jointSecretKeyA = createJointSecretKey(privateKeyA.getPrivateKey(), publicKeys);
const jointSecretKeyB = createJointSecretKey(privateKeyB.getPrivateKey(), publicKeys);
const jointSecretKeyC = createJointSecretKey(privateKeyC.getPrivateKey(), publicKeys);

console.log("Joint Secret Key A:", jointSecretKeyA);
console.log("Joint Secret Key B:", jointSecretKeyB);
console.log("Joint Secret Key C:", jointSecretKeyC);
*/



/* //HIS COMMES VERY CLOSE
const crypto = require('crypto');

// Function to perform Diffie-Hellman key exchange for a single participant
function performDHKeyExchange(privateKey, publicKeys) {
    // Create a Diffie-Hellman instance with the participant's private key
    const diffieHellman = crypto.createDiffieHellman('secp256k1');
    diffieHellman.setPrivateKey(privateKey, 'hex');

    // Compute shared secrets with other participants' public keys
    const sharedSecrets = publicKeys.map(publicKey => {
        return diffieHellman.computeSecret(publicKey, 'hex', 'hex');
    });

    console.log('Shared Secrets:', sharedSecrets);

    // Combine shared secrets to generate the joint secret key
    let jointSecretKey = Buffer.alloc(32, 0); // Initialize with zeros
    for (const sharedSecret of sharedSecrets) {
        jointSecretKey = xorBuffers(jointSecretKey, Buffer.from(sharedSecret, 'hex'));
    }

    return jointSecretKey.toString('hex');
}

// Function to perform bitwise XOR operation on two buffers
function xorBuffers(buffer1, buffer2) {
    const result = Buffer.alloc(Math.max(buffer1.length, buffer2.length));
    for (let i = 0; i < result.length; i++) {
        result[i] = buffer1[i] ^ buffer2[i];
    }
    return result;
}

// Example usage:

// Generate private key for participant A
const privateKeyA = crypto.randomBytes(32).toString('hex'); // Example private key for participant A
console.log('Private Key A:', privateKeyA);

// Generate private key for participant B
const privateKeyB = crypto.randomBytes(32).toString('hex'); // Example private key for participant B
console.log('Private Key B:', privateKeyB);

// Generate public key for participant A
const publicKeyA = crypto.createECDH('secp256k1');
publicKeyA.setPrivateKey(privateKeyA, 'hex');
const publicKeyAHex = publicKeyA.getPublicKey('hex');
console.log('Public Key A:', publicKeyAHex);

// Generate public key for participant B
const publicKeyB = crypto.createECDH('secp256k1');
publicKeyB.setPrivateKey(privateKeyB, 'hex');
const publicKeyBHex = publicKeyB.getPublicKey('hex');
console.log('Public Key B:', publicKeyBHex);

// Define public keys of other participants for each participant
const publicKeysA = [publicKeyBHex]; // Participant A shares public key of participant B
const publicKeysB = [publicKeyAHex]; // Participant B shares public key of participant A

// Perform Diffie-Hellman key exchange for participant A
const sharedKeyA = performDHKeyExchange(privateKeyA, publicKeysA);
console.log('Participant A Shared Key:', sharedKeyA);

// Perform Diffie-Hellman key exchange for participant B
const sharedKeyB = performDHKeyExchange(privateKeyB, publicKeysB);
console.log('Participant B Shared Key:', sharedKeyB);
*/



/* // THIS WORKES BUT SOLELY FOR TWO PARTIES
const crypto = require('crypto');

const alice = crypto.getDiffieHellman('modp15');
const bob = crypto.getDiffieHellman('modp15');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

//To verify we are using the 3072 bit prime
console.log(alice.getPrime().toString('hex').length * 4);
//To verify both have generated the same secret
console.log(aliceSecret === bobSecret);
//The value of shared secret of Alice
console.log(aliceSecret);
//The value of shared secret of Bob
console.log(bobSecret);
*/



/*
const crypto = require('crypto');

// Function to perform Diffie-Hellman key exchange for a single participant
function performDHKeyExchange(privateKey, publicKeys) {
    // Create a Diffie-Hellman instance with the participant's private key
    const diffieHellman = crypto.createDiffieHellman('modp15');
    diffieHellman.setPrivateKey(privateKey, 'hex');

    // Compute shared secrets with other participants' public keys
    const sharedSecrets = publicKeys.map(publicKey => {
        return diffieHellman.computeSecret(publicKey, 'hex', 'hex');
    });

    console.log('Shared Secrets:', sharedSecrets);

    // Combine shared secrets to generate the joint secret key
    let jointSecretKey = Buffer.alloc(32, 0); // Initialize with zeros
    for (const sharedSecret of sharedSecrets) {
        jointSecretKey = xorBuffers(jointSecretKey, Buffer.from(sharedSecret, 'hex'));
    }

    return jointSecretKey.toString('hex');
}

// Function to perform bitwise XOR operation on two buffers
function xorBuffers(buffer1, buffer2) {
    const result = Buffer.alloc(Math.max(buffer1.length, buffer2.length));
    for (let i = 0; i < result.length; i++) {
        result[i] = buffer1[i] ^ buffer2[i];
    }
    return result;
}

// Example usage:

// Generate private key for participant A
const privateKeyAlice = crypto.createDiffieHellman(3072).generateKeys('hex');

// Generate private key for participant B
const privateKeyBob = crypto.createDiffieHellman(3072).generateKeys('hex');

// Generate private key for participant C
const privateKeyCharlie = crypto.createDiffieHellman(3072).generateKeys('hex');

// Generate public key for participant A
const publicKeyAlice = crypto.createDiffieHellman(3072).setPrivateKey(privateKeyAlice, 'hex').getPublicKey('hex');

// Generate public key for participant B
const publicKeyBob = crypto.createDiffieHellman(3072).setPrivateKey(privateKeyBob, 'hex').getPublicKey('hex');

// Generate public key for participant C
const publicKeyCharlie = crypto.createDiffieHellman(3072).setPrivateKey(privateKeyCharlie, 'hex').getPublicKey('hex');

// Define public keys of other participants for each participant
const publicKeysAlice = [publicKeyBob, publicKeyCharlie]; // Participant A shares public keys of participants B and C
const publicKeysBob = [publicKeyAlice, publicKeyCharlie]; // Participant B shares public keys of participants A and C
const publicKeysCharlie = [publicKeyAlice, publicKeyBob]; // Participant C shares public keys of participants A and B

// Perform Diffie-Hellman key exchange for participant A
const sharedKeyAlice = performDHKeyExchange(privateKeyAlice, publicKeysAlice);
console.log('Participant A Shared Key:', sharedKeyAlice);

// Perform Diffie-Hellman key exchange for participant B
const sharedKeyBob = performDHKeyExchange(privateKeyBob, publicKeysBob);
console.log('Participant B Shared Key:', sharedKeyBob);

// Perform Diffie-Hellman key exchange for participant C
const sharedKeyCharlie = performDHKeyExchange(privateKeyCharlie, publicKeysCharlie);
console.log('Participant C Shared Key:', sharedKeyCharlie)
*/

const crypto = require('crypto');

// Converts a byte array to hex string
function toHexString(byteArray) {
    return byteArray.reduce((output, byte) => 
        (output + ('0' + (byte & 0xFF).toString(16)).slice(-2)), '');
}

// Alice creates her own DH key pair with 2048-bit key size
const aliceKpair = crypto.createDiffieHellman(2048);
aliceKpair.generateKeys();

// Bob creates his own DH key pair using the same params
const bobKpair = crypto.createDiffieHellman(aliceKpair.getPrime(), aliceKpair.getGenerator());
bobKpair.generateKeys();

// Carol creates her own DH key pair using the same params
const carolKpair = crypto.createDiffieHellman(aliceKpair.getPrime(), aliceKpair.getGenerator());
carolKpair.generateKeys();

// Sara creates her own DH key pair using the same params
const saraKpair = crypto.createDiffieHellman(aliceKpair.getPrime(), aliceKpair.getGenerator());
saraKpair.generateKeys();

// First Pass
const gSA = aliceKpair.computeSecret(saraKpair.getPublicKey());
const gAB = bobKpair.computeSecret(aliceKpair.getPublicKey());
const gBC = carolKpair.computeSecret(bobKpair.getPublicKey());
const gCS = saraKpair.computeSecret(carolKpair.getPublicKey());

// Second Pass
const gCSA = aliceKpair.computeSecret(gCS);
const gSAB = bobKpair.computeSecret(gSA);
const gABC = carolKpair.computeSecret(gAB);
const gBCS = saraKpair.computeSecret(gBC);

// Third Pass
const gBCSA = aliceKpair.computeSecret(gBCS); // This is Alice's secret
const gCSAB = bobKpair.computeSecret(gCSA); // This is Bob's secret
const gABCS = saraKpair.computeSecret(gABC); // This is Sara's secret
const gSABC = carolKpair.computeSecret(gSAB); // This is Carol's secret

console.log("Alice secret: " + toHexString(gBCSA));
console.log("Bob secret: " + toHexString(gCSAB));
console.log("Carol secret: " + toHexString(gABCS));
console.log("Sara secret: " + toHexString(gSABC));

// Comparisons
console.log("Alice and Bob are " + (gBCSA.equals(gCSAB) ? "the same" : "different"));
console.log("Bob and Carol are " + (gCSAB.equals(gABCS) ? "the same" : "different"));
console.log("Carol and Sara are " + (gABCS.equals(gSABC) ? "the same" : "different"));