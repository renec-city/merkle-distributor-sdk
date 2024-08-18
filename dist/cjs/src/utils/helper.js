"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateATAInstruction = exports.deriveClaimStatus = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const spl_token_1 = require("@solana/spl-token");
function deriveClaimStatus(claimant, distributor, programId) {
    return anchor_1.web3.PublicKey.findProgramAddressSync([Buffer.from('ClaimStatus'), claimant.toBytes(), distributor.toBytes()], programId);
}
exports.deriveClaimStatus = deriveClaimStatus;
const getOrCreateATAInstruction = (tokenMint, owner, connection, allowOwnerOffCurve = true, payer = owner) => __awaiter(void 0, void 0, void 0, function* () {
    let toAccount;
    try {
        toAccount = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, tokenMint, owner, allowOwnerOffCurve);
        const account = yield connection.getAccountInfo(toAccount);
        if (!account) {
            const ix = spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, tokenMint, toAccount, owner, payer);
            return [toAccount, ix];
        }
        return [toAccount, undefined];
    }
    catch (e) {
        /* handle error */
        console.error('Error::getOrCreateATAInstruction', e);
        throw e;
    }
});
exports.getOrCreateATAInstruction = getOrCreateATAInstruction;
//# sourceMappingURL=helper.js.map