import { TransactionObject } from 'web3-eth';
export declare enum Op {
    EQ = "EQ",
    NEQ = "NEQ",
    LT = "LT",
    LTE = "LTE",
    GT = "GT",
    GTE = "GTE"
}
export declare function requireOp<A>(value: A, op: Op, expected: A, ctx: string): void;
export declare function requireCall<A>(callPromise: TransactionObject<A>, op: Op, expected: A, ctx: string): Promise<void>;
