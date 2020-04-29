/// <reference types="node" />
import { EventEmitter } from 'events';
import Web3 from 'web3';
import { EventLog } from 'web3-core';
import { Callback } from 'web3-core-helpers';
import { BlockType, TransactionObject } from 'web3-eth';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
interface EventOptions {
    filter?: object;
    fromBlock?: BlockType;
    topics?: string[];
}
interface ContractEventLog<T> extends EventLog {
    returnValues: T;
}
interface ContractEventEmitter<T> extends EventEmitter {
    on(event: 'connected', listener: (subscriptionId: string) => void): this;
    on(event: 'data' | 'changed', listener: (event: ContractEventLog<T>) => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
}
declare type ContractEvent<T> = (options?: EventOptions, cb?: Callback<ContractEventLog<T>>) => ContractEventEmitter<T>;
export interface MultiSig extends Contract {
    clone(): MultiSig;
    methods: {
        owners(arg0: number | string): TransactionObject<string>;
        initialized(): TransactionObject<boolean>;
        isOwner(arg0: string): TransactionObject<boolean>;
        confirmations(arg0: number | string, arg1: string): TransactionObject<boolean>;
        transactions(arg0: number | string): TransactionObject<{
            destination: string;
            value: string;
            data: string;
            executed: boolean;
            0: string;
            1: string;
            2: string;
            3: boolean;
        }>;
        internalRequired(): TransactionObject<string>;
        transactionCount(): TransactionObject<string>;
        MAX_OWNER_COUNT(): TransactionObject<string>;
        required(): TransactionObject<string>;
        initialize(_owners: string[], _required: number | string, _internalRequired: number | string): TransactionObject<void>;
        addOwner(owner: string): TransactionObject<void>;
        removeOwner(owner: string): TransactionObject<void>;
        replaceOwner(owner: string, newOwner: string): TransactionObject<void>;
        changeRequirement(_required: number | string): TransactionObject<void>;
        changeInternalRequirement(_internalRequired: number | string): TransactionObject<void>;
        submitTransaction(destination: string, value: number | string, data: string | number[]): TransactionObject<string>;
        confirmTransaction(transactionId: number | string): TransactionObject<void>;
        revokeConfirmation(transactionId: number | string): TransactionObject<void>;
        executeTransaction(transactionId: number | string): TransactionObject<void>;
        isConfirmed(transactionId: number | string): TransactionObject<boolean>;
        getConfirmationCount(transactionId: number | string): TransactionObject<string>;
        getTransactionCount(pending: boolean, executed: boolean): TransactionObject<string>;
        getOwners(): TransactionObject<string[]>;
        getConfirmations(transactionId: number | string): TransactionObject<string[]>;
        getTransactionIds(from: number | string, to: number | string, pending: boolean, executed: boolean): TransactionObject<string[]>;
    };
    events: {
        Confirmation: ContractEvent<{
            sender: string;
            transactionId: string;
            0: string;
            1: string;
        }>;
        Revocation: ContractEvent<{
            sender: string;
            transactionId: string;
            0: string;
            1: string;
        }>;
        Submission: ContractEvent<string>;
        Execution: ContractEvent<{
            transactionId: string;
            returnData: string;
            0: string;
            1: string;
        }>;
        Deposit: ContractEvent<{
            sender: string;
            value: string;
            0: string;
            1: string;
        }>;
        OwnerAddition: ContractEvent<string>;
        OwnerRemoval: ContractEvent<string>;
        RequirementChange: ContractEvent<string>;
        InternalRequirementChange: ContractEvent<string>;
        allEvents: (options?: EventOptions, cb?: Callback<EventLog>) => EventEmitter;
    };
}
export declare const ABI: AbiItem[];
export declare function newMultiSig(web3: Web3, address: string): MultiSig;
export {};
