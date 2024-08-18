import { MerkleDistributor } from './src';
import { getOrCreateATAInstruction, deriveClaimStatus } from './src/utils';
import { IDL } from './src/types/merkle_distributor';

export default MerkleDistributor;

export {
  IDL,
  // Helper
  getOrCreateATAInstruction,
  deriveClaimStatus,
};

export type { UserResponse } from './src/index';
export type { MerkleDistributor as MerkleDistributorIDL } from './src/types/merkle_distributor';
