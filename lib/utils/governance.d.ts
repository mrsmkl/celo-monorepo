import { ContractKit } from '@celo/contractkit';
export declare const buildProposalFromJsonFile: (kit: ContractKit, jsonFile: string) => Promise<Pick<import("web3/eth/types").Transaction, "to" | "value" | "input">[]>;
