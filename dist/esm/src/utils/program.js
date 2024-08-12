import { Program } from '@coral-xyz/anchor';
import { IDL as MerkleDistributorIDL } from '../types/merkle_distributor';
export function createMerkleDistributorProgram(provider, programId) {
    const program = new Program(MerkleDistributorIDL, programId, provider);
    return program;
}
export function readOnlyMerkleDistributorProgram(con, programId) {
    const program = new Program(MerkleDistributorIDL, programId, { connection: con });
    return program;
}
//# sourceMappingURL=program.js.map