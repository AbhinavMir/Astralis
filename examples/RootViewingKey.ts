import { ElusivViewer } from '@elusiv/sdk';
import { getParams } from './boilerplate';
import { CLUSTER } from './constants';

async function main() {
    // Helper function for generating the elusiv instance
    // THIS IS NOT PART OF THE SDK, check boilerplate.ts to see what exactly it does.
    const { elusiv, conn } = await getParams();

    // Fetch our current private balance
    const privateBalance = await elusiv.getLatestPrivateBalance('LAMPORTS');
    console.log(`Current private balance: ${privateBalance}`);

    // Now, we generate a viewing key and get the Elusiv Viewer instance

    // Get the root viewing key for the user
    const rvk = elusiv.getRootViewingKey();
    console.log(`Generated viewing key: ${rvk}`);

    // Create ElusivViewer instance
    const viewer = await ElusivViewer.getElusivViewerInstance(
        rvk,
        conn,
        CLUSTER,
    );

    // Fetch our current private balance (with ElusivViewer)
    const viewerBalance = await viewer.getLatestPrivateBalance('LAMPORTS');
    console.log(`Current private balance (with ElusivViewer): ${viewerBalance}`);

    // Fetch our last 5 private transactions (if we only have 1 it will only return 1 of course)
    const last5PrivTxs = await elusiv.getPrivateTransactions(5);

    console.log('Our last 5 private transactions:\n');
    console.log(last5PrivTxs);

    // Fetch our last 5 private transactions with ElusivViewer (if we only have 1 it will only return 1 of course)
    const last5PrivTxsWithViewer = await viewer.getPrivateTransactions(5);

    console.log('Our last 5 private transactions (with ElusivViewer):\n');
    console.log(last5PrivTxsWithViewer);

    // Fetch our last 5 private SOL transactions (if we only have 1 it will only return 1 of course)
    const last5SolPrivTxs = await elusiv.getPrivateTransactions(5, 'LAMPORTS');

    console.log('Our last 5 private SOL transactions:\n');
    console.log(last5SolPrivTxs);

    // Fetch our last 5 private SOL transactions with Elusiv Viewer (if we only have 1 it will only return 1 of course)
    const last5SolPrivTxsWithViewer = await viewer.getPrivateTransactions(5, 'LAMPORTS');
    console.log('Our last 5 private SOL transactions (with ElusivViewer):\n');
    console.log(last5SolPrivTxsWithViewer);
}

// Run main when invoking this file
main().then(
    () => process.exit(),
    (err) => {
        throw err;
    },
);
