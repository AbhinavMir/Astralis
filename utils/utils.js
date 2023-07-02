import {
  Elusiv,
  SEED_MESSAGE
} from "@elusiv/sdk";
import {
  Keypair,
  Connection,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import { sign } from "@noble/ed25519";
import {
  getDomainKey,
  NameRegistryState,
} from "@bonfida/spl-name-service";

const CLUSTER = "devnet";
const DEVNET_RPC_URL = "https://devnet.solana.com";

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

async function topup(
  elusivInstance,
  keyPair,
  amount,
  tokenType
) {
  // Build our topup transaction
  const topupTx = await elusivInstance.buildTopUpTx(amount, tokenType);
  // Sign it (only needed for topups, as we're topping up from our public key there)
  topupTx.tx.partialSign(keyPair);
  // Send it off
  return elusivInstance.sendElusivTx(topupTx);
}

async function send(
  elusiv,
  recipient,
  amount,
  tokenType
) {
  // Build the send transaction
  const sendTx = await elusiv.buildSendTx(amount, recipient, tokenType);
  // Send it off!
  return elusiv.sendElusivTx(sendTx);
}

async function onramp_fiat(amount, tokenType) {
  // waiting for reply from MoonPay, Transak etc.
  return null;
}

async function resolve(connection, domainName) {
  // Step 1: Get domain key
  const { pubkey } = await getDomainKey(domainName);

  // Step 2: Retrieve registry and NFT owner
  const { registry, nftOwner } = await NameRegistryState.retrieve(
    connection,
    pubkey
  );

  // Check if the domain is owned by an NFT
  if (nftOwner) {
    // The domain is owned by an NFT, do something with the NFT owner's pubkey
    console.log("NFT owner pubkey:", nftOwner.toBase58());
  } else {
    // The domain is not owned by an NFT, do something else
    console.log("Domain is not owned by an NFT");
  }

  // Subdomain derivation
  const subDomain = "dex." + domainName;
  const { pubkey: subKey } = await getDomainKey(subDomain);

  // Record derivation
  const record = "IPFS." + domainName;
  const { pubkey: recordKey } = await getDomainKey(record, true);

  // Do something with the resolved subKey and recordKey
  console.log("Subdomain pubkey:", subKey.toBase58());
  console.log("Record pubkey:", recordKey.toBase58());
}

// <-----------------------------------***TESTING**------------------------------------------->

let connection = new Connection(clusterApiUrl("testnet"));
const devnet_url = "AM8xzq88VPhuD3za7546V9m5y5WtuAhvKytkFpF2Xppm";
const devnet = new PublicKey(devnet_url);
// get balance of devnet
connection.getBalance(devnet).then((balance) => console.log(balance));
