import { BN, web3 } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, TransactionInstruction, Connection } from '@solana/web3.js';

import { MerkleDistributor as MerkleDistributorType } from './types/merkle_distributor';
import {
  createMerkleDistributorProgram,
  readOnlyMerkleDistributorProgram,
  deriveClaimStatus,
  getOrCreateATAInstruction,
} from './utils';

export interface UserResponse {
  merkle_tree: string;
  amount: number;
  proof: number[][];
}
export interface DistributorResponse {
  max_num_nodes: number,
  max_total_claim: BN,
  trees: Array<SingleDistributor>
}

export interface SingleDistributor {
  distributor_pubkey: String,
  merkle_root: Array<number>;
  airdrop_version: number;
  max_num_nodes: number;
  max_total_claim: number;
}

export class MerkleDistributor {
  private mdProgram?: anchor.Program<MerkleDistributorType>;
  private mint: web3.PublicKey;
  private claimProofEndpoint: string;

  constructor(
    private provider: anchor.AnchorProvider,
    options: {
      targetToken: web3.PublicKey;
      claimProofEndpoint: string;
      merkleDistributorProgramId: PublicKey;
    },
  ) {
    this.mdProgram = createMerkleDistributorProgram(this.provider, options.merkleDistributorProgramId);
    this.mint = options.targetToken;
    this.claimProofEndpoint = options.claimProofEndpoint;
  }

  get program() {
    return this.mdProgram;
  }

  static async getDistributorStatus(con: Connection, merkleDistributorProgramId: string, claimProofEndpoint: string) {
    try {
      const res = await fetch(`${claimProofEndpoint}/distributors`);

      if (!res.ok) {
        return null;
      }
      const distributor: DistributorResponse = await res.json();

      if (distributor.trees.length < 1) return null;

      const program = readOnlyMerkleDistributorProgram(con, new web3.PublicKey(merkleDistributorProgramId))

      const status = await program.account.merkleDistributor.fetchNullable(new web3.PublicKey(distributor.trees[0].distributor_pubkey));

      if (status) {
        return {
          status,
          distributor,
        }
      } else {
        return null
      }
    } catch (error) {
      return null;
    }

  }

  async getTest() {
    return "test";
  }

  async getUser(claimant: web3.PublicKey): Promise<UserResponse | null> {
    try {
      const res = await fetch(`${this.claimProofEndpoint}/user/${claimant.toBase58()}`);

      if (!res.ok) {
        return null;
      }
      const user = await res.json();
      return user;
    } catch (error) {
      return null;
    }
  }

  async claimToken(claimant: web3.PublicKey) {
    const {
      provider: { connection },
      mdProgram,
      mint,
    } = this;

    if (!claimant || !mint || !mdProgram) {
      return;
    }

    const user = await this.getUser(claimant);

    if (!user) {
      return;
    }

    const { proof, merkle_tree } = user;
    const distributor = new web3.PublicKey(merkle_tree);
    const [claimStatus, _csBump] = deriveClaimStatus(claimant, distributor, mdProgram.programId);

    const preInstructions: TransactionInstruction[] = [];

    const [toATA, toATAIx] = await getOrCreateATAInstruction(mint, claimant, connection, true, claimant);
    toATAIx && preInstructions.push(toATAIx);

    const [mdATA, mdATAIx] = await getOrCreateATAInstruction(mint, distributor, connection, true, claimant);
    mdATAIx && preInstructions.push(mdATAIx);

    return [
      ...preInstructions,
      await mdProgram.methods
        .newClaim(new BN(user.amount), new BN(0), proof as any)
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
  }

  async getClaimStatus(claimant: web3.PublicKey): Promise<{ amount: BN; isClaimed: boolean } | null> {
    const { mdProgram } = this;

    if (!claimant || !mdProgram) {
      return null;
    }

    const user = await this.getUser(claimant);

    if (!user || !user.merkle_tree) {
      return null;
    }

    const [claimStatus, _csBump] = deriveClaimStatus(
      claimant,
      new web3.PublicKey(user.merkle_tree),
      mdProgram.programId,
    );

    const status = await mdProgram.account.claimStatus.fetchNullable(claimStatus);

    return {
      amount: new BN(user.amount),
      isClaimed: Boolean(status),
    };
  }
}
