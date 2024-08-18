import { BN, web3 } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import { PublicKey, Connection } from '@solana/web3.js';
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
    private claimProofEndpoint;
    constructor(provider: anchor.AnchorProvider, options: {
        claimProofEndpoint: string;
        merkleDistributorProgramId: PublicKey;
    });
    get program(): anchor.Program<MerkleDistributorType> | undefined;
    static getDistributorStatus(con: Connection, merkleDistributorProgramId: string, claimProofEndpoint: string, mint: web3.PublicKey, base: web3.PublicKey): Promise<{
        status: {
            bump: number;
            version: BN;
            root: number[];
            mint: web3.PublicKey;
            base: web3.PublicKey;
            tokenVault: web3.PublicKey;
            maxTotalClaim: BN;
            maxNumNodes: BN;
            totalAmountClaimed: BN;
            numNodesClaimed: BN;
            startTs: BN;
            endTs: BN;
            clawbackStartTs: BN;
            clawbackReceiver: web3.PublicKey;
            admin: web3.PublicKey;
            clawedBack: boolean;
            enableSlot: BN;
            closable: boolean;
            buffer0: number[];
            buffer1: number[];
            buffer2: number[];
        };
        distributor: DistributorResponse;
    } | null>;
    getUser(mint: web3.PublicKey, base: web3.PublicKey, claimant: web3.PublicKey): Promise<UserResponse | null>;
    claimToken(mint: web3.PublicKey, base: web3.PublicKey, claimant: web3.PublicKey): Promise<web3.TransactionInstruction[] | undefined>;
    getClaimStatus(mint: web3.PublicKey, base: web3.PublicKey, claimant: web3.PublicKey): Promise<{
        amount: BN;
        isClaimed: boolean;
    } | null>;
}
//# sourceMappingURL=index.d.ts.map