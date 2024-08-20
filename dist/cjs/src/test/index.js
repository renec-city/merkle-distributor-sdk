"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const index_1 = require("../index");
const anchor_1 = require("@coral-xyz/anchor");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const mint = new web3_js_1.PublicKey("xyz");
    const base = new web3_js_1.PublicKey("x");
    const user = web3_js_1.Keypair.fromSecretKey(Uint8Array[0]);
    let MERKLE_DISTRIBUTOR_PROGRAM_ID = new web3_js_1.PublicKey("x");
    const connection = new web3_js_1.Connection("x");
    const keyPair = user;
    const wallet = new anchor_1.Wallet(keyPair);
    const provider = new anchor_1.AnchorProvider(connection, wallet, {
        commitment: 'confirmed'
    });
    const merkleDistributor = new index_1.MerkleDistributor(provider, {
        claimProofEndpoint: 'http://localhost:7001',
        merkleDistributorProgramId: new web3_js_1.PublicKey(MERKLE_DISTRIBUTOR_PROGRAM_ID)
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
    const transaction = new web3_js_1.Transaction();
    transaction.add(web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 100000
    }));
    transaction.add(web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
        units: 100000
    }));
    instructions.forEach(s => {
        transaction.add(s);
    });
    const sig = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [
        keyPair
    ]);
    console.log(sig);
}))();
//# sourceMappingURL=index.js.map