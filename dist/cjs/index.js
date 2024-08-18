"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveClaimStatus = exports.getOrCreateATAInstruction = exports.IDL = void 0;
const src_1 = require("./src");
const utils_1 = require("./src/utils");
Object.defineProperty(exports, "getOrCreateATAInstruction", { enumerable: true, get: function () { return utils_1.getOrCreateATAInstruction; } });
Object.defineProperty(exports, "deriveClaimStatus", { enumerable: true, get: function () { return utils_1.deriveClaimStatus; } });
const merkle_distributor_1 = require("./src/types/merkle_distributor");
Object.defineProperty(exports, "IDL", { enumerable: true, get: function () { return merkle_distributor_1.IDL; } });
exports.default = src_1.MerkleDistributor;
//# sourceMappingURL=index.js.map