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
exports.MerkleDistributor = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const spl_token_1 = require("@solana/spl-token");
const utils_1 = require("./utils");
class MerkleDistributor {
    constructor(provider, options) {
        this.provider = provider;
        this.mdProgram = (0, utils_1.createMerkleDistributorProgram)(this.provider, options.merkleDistributorProgramId);
        this.mint = options.targetToken;
        this.claimProofEndpoint = options.claimProofEndpoint;
    }
    get program() {
        return this.mdProgram;
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
                const status = yield mdProgram.account.merkleDistributor.fetchNullable(new anchor_1.web3.PublicKey(distributor.trees[0].distributor_pubkey));
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
    getTest() {
        return __awaiter(this, void 0, void 0, function* () {
            return "test";
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
            const distributor = new anchor_1.web3.PublicKey(merkle_tree);
            const [claimStatus, _csBump] = (0, utils_1.deriveClaimStatus)(claimant, distributor, mdProgram.programId);
            const preInstructions = [];
            const [toATA, toATAIx] = yield (0, utils_1.getOrCreateATAInstruction)(mint, claimant, connection, true, claimant);
            toATAIx && preInstructions.push(toATAIx);
            const [mdATA, mdATAIx] = yield (0, utils_1.getOrCreateATAInstruction)(mint, distributor, connection, true, claimant);
            mdATAIx && preInstructions.push(mdATAIx);
            return [
                ...preInstructions,
                yield mdProgram.methods
                    .newClaim(new anchor_1.BN(user.amount), new anchor_1.BN(0), proof)
                    .accounts({
                    claimant,
                    claimStatus,
                    distributor: distributor,
                    from: mdATA,
                    to: toATA,
                    systemProgram: anchor_1.web3.SystemProgram.programId,
                    tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
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
            const [claimStatus, _csBump] = (0, utils_1.deriveClaimStatus)(claimant, new anchor_1.web3.PublicKey(user.merkle_tree), mdProgram.programId);
            const status = yield mdProgram.account.claimStatus.fetchNullable(claimStatus);
            return {
                amount: new anchor_1.BN(user.amount),
                isClaimed: Boolean(status),
            };
        });
    }
}
exports.MerkleDistributor = MerkleDistributor;
//# sourceMappingURL=index.js.map