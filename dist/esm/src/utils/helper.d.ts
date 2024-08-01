import { web3 } from '@coral-xyz/anchor';
import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
export declare function deriveClaimStatus(claimant: web3.PublicKey, distributor: web3.PublicKey, programId: web3.PublicKey): [web3.PublicKey, number];
export declare const getOrCreateATAInstruction: (tokenMint: PublicKey, owner: PublicKey, connection: Connection, allowOwnerOffCurve?: boolean, payer?: web3.PublicKey) => Promise<[PublicKey, TransactionInstruction?]>;
//# sourceMappingURL=helper.d.ts.map