import { BN, web3 } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { MerkleDistributor as MerkleDistributorType } from './types/merkle_distributor';
export interface UserResponse {
    merkle_tree: string;
    amount: number;
    proof: number[][];
}
export interface DistributorResponse {
    max_num_nodes: number;
    max_total_claim: BN;
    trees: Array<SingleDistributor>;
}
export interface SingleDistributor {
    distributor_pubkey: String;
    merkle_root: Array<number>;
    airdrop_version: number;
    max_num_nodes: number;
    max_total_claim: number;
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
    get program(): anchor.Program<MerkleDistributorType> | undefined;
    getDistributorStatus(): Promise<any | null>;
    getUser(claimant: web3.PublicKey): Promise<UserResponse | null>;
    claimToken(claimant: web3.PublicKey): Promise<web3.TransactionInstruction[] | undefined>;
    getClaimStatus(claimant: web3.PublicKey): Promise<{
        amount: BN;
        isClaimed: boolean;
    } | null>;
}
//# sourceMappingURL=index.d.ts.map