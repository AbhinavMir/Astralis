const { sign } = require('@noble/ed25519');
const { Connection, Keypair } = require('@solana/web3.js');
const { Elusiv, SEED_MESSAGE } = require('@elusiv/sdk');

const CLUSTER = 'devnet';
const DEVNET_RPC_URL = 'https://devnet.solana.com';

function generatePrivateKey() {
  const kp = Keypair.generate();
  console.log('Private key (add this to constants.ts):');
  console.log(kp.secretKey);
  console.log('Public key (airdrop some sol to this):');
  console.log(kp.publicKey.toBase58());

  return kp;
}

// Boilerplate code used by all samples

// Helper function to generate params used by all samples, namely a web3js connection, the keypair of the user, and the elusiv instance
async function getParams() {
  // Generate a keypair using the generatePrivateKey() function
  const keyPair = generatePrivateKey();

  // Connect to devnet
  const conn = new Connection(DEVNET_RPC_URL);

  // Generate the input seed. Remember, this is almost as important as the private key, so don't log this!
  // (We use sign from an external library here because there is no wallet connected. Usually you'd use the wallet adapter here)
  // (Slice because in Solana's keypair type the first 32 bytes is the privkey and the last 32 is the pubkey)
  const seed = await sign(
    Buffer.from(SEED_MESSAGE, 'utf-8'),
    keyPair.secretKey.slice(0, 32)
  );

  // Create the elusiv instance
  const elusiv = await Elusiv.getElusivInstance(
    seed,
    keyPair.publicKey,
    conn,
    CLUSTER
  );

  return { elusiv, keyPair, conn };
}

module.exports = {
  CLUSTER,
  DEVNET_RPC_URL,
  generatePrivateKey,
  getParams
};
