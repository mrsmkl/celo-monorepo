import Web3 from 'web3';
export declare function nodeIsSynced(web3: Web3): Promise<boolean>;
export declare function requireNodeIsSynced(web3: Web3): Promise<void>;
export declare const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
