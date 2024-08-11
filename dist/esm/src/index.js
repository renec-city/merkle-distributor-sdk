var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BN, web3 } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { createMerkleDistributorProgram, deriveClaimStatus, getOrCreateATAInstruction, } from './utils';
export class MerkleDistributor {
    constructor(provider, options) {
        this.provider = provider;
        this.mdProgram = createMerkleDistributorProgram(this.provider, options.merkleDistributorProgramId);
        this.mint = options.targetToken;
        this.claimProofEndpoint = options.claimProofEndpoint;
    }
    getDistributorStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(`${this.claimProofEndpoint}/distributors`);
                if (!res.ok) {
                    return null;
                }
                const distributor = yield res.json();
                const { mdProgram, } = this;
                if (!mdProgram || distributor.trees.length < 1)
                    return null;
                const status = yield mdProgram.account.merkleDistributor.fetchNullable(new web3.PublicKey(distributor.trees[0].distributor_pubkey));
                if (status) {
                    return {
                        status,
                        distributor,
                    };
                }
                else {
                    return null;
                }
            }
            catch (error) {
                return null;
            }
        });
    }
    getUser(claimant) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(`${this.claimProofEndpoint}/user/${claimant.toBase58()}`);
                if (!res.ok) {
                    return null;
                }
                const user = yield res.json();
                return user;
            }
            catch (error) {
                return null;
            }
        });
    }
    claimToken(claimant) {
        return __awaiter(this, void 0, void 0, function* () {
            const { provider: { connection }, mdProgram, mint, } = this;
            if (!claimant || !mint || !mdProgram) {
                return;
            }
            const user = yield this.getUser(claimant);
            if (!user) {
                return;
            }
            const { proof, merkle_tree } = user;
            const distributor = new web3.PublicKey(merkle_tree);
            const [claimStatus, _csBump] = deriveClaimStatus(claimant, distributor, mdProgram.programId);
            const preInstructions = [];
            const [toATA, toATAIx] = yield getOrCreateATAInstruction(mint, claimant, connection, true, claimant);
            toATAIx && preInstructions.push(toATAIx);
            const [mdATA, mdATAIx] = yield getOrCreateATAInstruction(mint, distributor, connection, true, claimant);
            mdATAIx && preInstructions.push(mdATAIx);
            return [
                ...preInstructions,
                yield mdProgram.methods
                    .newClaim(new BN(user.amount), new BN(0), proof)
                    .accounts({
                    claimant,
                    claimStatus,
                    distributor: distributor,
                    from: mdATA,
                    to: toATA,
                    systemProgram: web3.SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                    .instruction(),
            ];
        });
    }
    getClaimStatus(claimant) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mdProgram } = this;
            if (!claimant || !mdProgram) {
                return null;
            }
            const user = yield this.getUser(claimant);
            if (!user || !user.merkle_tree) {
                return null;
            }
            const [claimStatus, _csBump] = deriveClaimStatus(claimant, new web3.PublicKey(user.merkle_tree), mdProgram.programId);
            const status = yield mdProgram.account.claimStatus.fetchNullable(claimStatus);
            return {
                amount: new BN(user.amount),
                isClaimed: Boolean(status),
            };
        });
    }
}
//# sourceMappingURL=index.js.map