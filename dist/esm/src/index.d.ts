import { BN, web3 } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
export interface UserResponse {
    merkle_tree: string;
    amount: number;
    proof: number[][];
}
export declare class MerkleDistributor {
    private provider;
    private mdProgram?;
    private mint;
    private claimProofEndpoint;
    constructor(provider: anchor.AnchorProvider, options: {
        targetToken: web3.PublicKey;
        claimProofEndpoint: string;
        merkleDistributorProgramId: PublicKey;
    });
    getUser(claimant: web3.PublicKey): Promise<UserResponse | null>;
    claimToken(claimant: web3.PublicKey): Promise<web3.TransactionInstruction[] | undefined>;
    getClaimStatus(claimant: web3.PublicKey): Promise<{
        amount: BN;
        isClaimed: boolean;
    } | null>;
}
//# sourceMappingURL=index.d.ts.map