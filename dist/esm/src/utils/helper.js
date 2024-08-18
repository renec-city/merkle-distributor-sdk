var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { web3 } from '@coral-xyz/anchor';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
export function deriveClaimStatus(claimant, distributor, programId) {
    return web3.PublicKey.findProgramAddressSync([Buffer.from('ClaimStatus'), claimant.toBytes(), distributor.toBytes()], programId);
}
export const getOrCreateATAInstruction = (tokenMint, owner, connection, allowOwnerOffCurve = true, payer = owner) => __awaiter(void 0, void 0, void 0, function* () {
    let toAccount;
    try {
        toAccount = yield Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, tokenMint, owner, allowOwnerOffCurve);
        const account = yield connection.getAccountInfo(toAccount);
        if (!account) {
            const ix = Token.createAssociatedTokenAccountInstruction(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, tokenMint, toAccount, owner, payer);
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
//# sourceMappingURL=helper.js.map