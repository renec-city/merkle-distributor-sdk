"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readOnlyMerkleDistributorProgram = exports.createMerkleDistributorProgram = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const merkle_distributor_1 = require("../types/merkle_distributor");
function createMerkleDistributorProgram(provider, programId) {
    const program = new anchor_1.Program(merkle_distributor_1.IDL, programId, provider);
    return program;
}
exports.createMerkleDistributorProgram = createMerkleDistributorProgram;
function readOnlyMerkleDistributorProgram(con, programId) {
    const program = new anchor_1.Program(merkle_distributor_1.IDL, programId, { connection: con });
    return program;
}
exports.readOnlyMerkleDistributorProgram = readOnlyMerkleDistributorProgram;
//# sourceMappingURL=program.js.map