import * as anchor from '@coral-xyz/anchor';
import { web3 } from '@coral-xyz/anchor';
import { MerkleDistributor } from '../types/merkle_distributor';
import { Connection } from '@solana/web3.js';
export declare function createMerkleDistributorProgram(provider: anchor.Provider, programId: web3.PublicKey): anchor.Program<MerkleDistributor>;
export declare function readOnlyMerkleDistributorProgram(con: Connection, programId: web3.PublicKey): anchor.Program<MerkleDistributor>;
//# sourceMappingURL=program.d.ts.map