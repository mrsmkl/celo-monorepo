import { CeloTransactionObject } from '@celo/contractkit';
import { Tx } from 'web3-core';
export declare function displaySendTx<A>(name: string, txObj: CeloTransactionObject<A>, tx?: Omit<Tx, 'data'>, displayEventName?: string): Promise<void>;
export declare function printValueMap(valueMap: Record<string, any>, color?: import("chalk").Chalk & {
    supportsColor: import("chalk").ColorSupport;
}): void;
export declare function printValueMapRecursive(valueMap: Record<string, any>): void;
export declare function printVTable(valueMap: Record<string, any>): void;
export declare function failWith(msg: string): never;
export declare function binaryPrompt(promptMessage: string, defaultToNo?: boolean): Promise<boolean>;
