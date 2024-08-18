import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from '@solana/web3.js';
import { MerkleDistributor } from '../index';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';

(async () => {

  const mint = new PublicKey("xyz");
  const base = new PublicKey("x")
  const user = Keypair.fromSecretKey(Uint8Array[0]);
  let MERKLE_DISTRIBUTOR_PROGRAM_ID = new PublicKey("x");

  const connection = new Connection("x");
  const keyPair = user;
  const wallet = new Wallet(keyPair);
  const provider = new AnchorProvider(
    connection,
    wallet, {
    commitment: 'confirmed'
  }
  )
  const merkleDistributor = new MerkleDistributor(provider, {
    claimProofEndpoint: 'http://localhost:7001',
    merkleDistributorProgramId: new PublicKey(MERKLE_DISTRIBUTOR_PROGRAM_ID)
  });

  const status = await merkleDistributor.getClaimStatus(
    // (mint, user_address)
    mint,
    base,
    user.publicKey,
  );

  console.log(status);


  const userRes = await merkleDistributor.getUser(mint,
    base,
    user.publicKey);

  console.log(userRes);


  const instructions = await merkleDistributor.claimToken(mint, base,
    user.publicKey)

  if (!instructions) {
    return;
  }

  const transaction = new Transaction();

  transaction.add(
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 100000
    })
  )

  transaction.add(
    ComputeBudgetProgram.setComputeUnitLimit({
      units: 100000
    })
  )

  instructions.forEach(s => {
    transaction.add(s);
  })

  const sig = await sendAndConfirmTransaction(connection, transaction, [
    keyPair
  ])

  console.log(sig)

})()
