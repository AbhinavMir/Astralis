const {
    Keypair,
    Connection,
    Cluster,
    PublicKey,
    clusterApiUrl,
  } = require("@solana/web3.js");

let connection = new Connection(clusterApiUrl("testnet"));
const devnet_url = "AM8xzq88VPhuD3za7546V9m5y5WtuAhvKytkFpF2Xppm";
const devnet = new PublicKey(devnet_url);
// get balance of devnet
connection.getBalance(devnet).then((balance) => console.log(balance));
