var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ComputeBudgetProgram, Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction, } from '@solana/web3.js';
import { MerkleDistributor } from '../index';
import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
(() => __awaiter(void 0, void 0, void 0, function* () {
    const mint = new PublicKey("xyz");
    const base = new PublicKey("x");
    const user = Keypair.fromSecretKey(Uint8Array[0]);
    let MERKLE_DISTRIBUTOR_PROGRAM_ID = new PublicKey("x");
    const connection = new Connection("x");
    const keyPair = user;
    const wallet = new Wallet(keyPair);
    const provider = new AnchorProvider(connection, wallet, {
        commitment: 'confirmed'
    });
    const merkleDistributor = new MerkleDistributor(provider, {
        claimProofEndpoint: 'http://localhost:7001',
        merkleDistributorProgramId: new PublicKey(MERKLE_DISTRIBUTOR_PROGRAM_ID)
    });
    const status = yield merkleDistributor.getClaimStatus(
    // (mint, user_address)
    mint, base, user.publicKey);
    console.log(status);
    const userRes = yield merkleDistributor.getUser(mint, base, user.publicKey);
    console.log(userRes);
    const instructions = yield merkleDistributor.claimToken(mint, base, user.publicKey);
    if (!instructions) {
        return;
    }
    const transaction = new Transaction();
    transaction.add(ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 100000
    }));
    transaction.add(ComputeBudgetProgram.setComputeUnitLimit({
        units: 100000
    }));
    instructions.forEach(s => {
        transaction.add(s);
    });
    const sig = yield sendAndConfirmTransaction(connection, transaction, [
        keyPair
    ]);
    console.log(sig);
}))();
//# sourceMappingURL=index.js.map