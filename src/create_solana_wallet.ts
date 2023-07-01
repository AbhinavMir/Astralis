import { Keypair } from "@solana/web3.js";

const generateKey = async (): Promise<Keypair> => {
  const keyPair: Keypair = Keypair.generate();
  return keyPair;
};

export const PRIV_KEY = (async () => {
  const keyPair = await generateKey();
  return keyPair.secretKey;
})();
