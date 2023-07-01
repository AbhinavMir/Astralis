const { airdropToken, Elusiv, getMintAccount, TokenType, SEED_MESSAGE } = require("@elusiv/sdk");
const { Keypair, Connection, Cluster } = require("@solana/web3.js");
const { sign } = require('@noble/ed25519');

const CLUSTER = 'devnet';
const DEVNET_RPC_URL = 'https://devnet.solana.com';

const generateKey = async () => {
  const keyPair = Keypair.generate();
  return keyPair;
};

async function getParams() {
  const keyPair = await generateKey();

  const conn = new Connection(DEVNET_RPC_URL);

  const seed = await sign(
    Buffer.from(SEED_MESSAGE, "utf-8"),
    keyPair.secretKey.slice(0, 32)
  );

  const elusiv = await Elusiv.getElusivInstance(
    seed,
    keyPair.publicKey,
    conn,
    CLUSTER
  );

  return { elusiv, keyPair, conn };
}

async function topup(elusivInstance, keyPair, amount, tokenType) {
  // Build our topup transaction
  const topupTx = await elusivInstance.buildTopUpTx(amount, tokenType);
  // Sign it (only needed for topups, as we're topping up from our public key there)
  topupTx.tx.partialSign(keyPair);
  // Send it off
  return elusivInstance.sendElusivTx(topupTx);
}

async function send(elusiv, recipient, amount, tokenType) {
  // Build the send transaction
  const sendTx = await elusiv.buildSendTx(amount, recipient, tokenType);
  // Send it off!
  return elusiv.sendElusivTx(sendTx);
}

async function onramp_fiat(amount, tokenType) {
  // waiting for reply from MoonPay, Transak etc.
  return null;
}
