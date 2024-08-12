import * as anchor from '@coral-xyz/anchor';
import { Program, web3 } from '@coral-xyz/anchor';

import { IDL as MerkleDistributorIDL, MerkleDistributor } from '../types/merkle_distributor';
import { Connection } from '@solana/web3.js';

export function createMerkleDistributorProgram(provider: anchor.Provider, programId: web3.PublicKey) {
  const program = new Program<MerkleDistributor>(MerkleDistributorIDL, programId, provider);

  return program;
}

export function readOnlyMerkleDistributorProgram(con: Connection, programId: web3.PublicKey) {
  const program = new Program<MerkleDistributor>(MerkleDistributorIDL, programId, { connection: con });

  return program;
}