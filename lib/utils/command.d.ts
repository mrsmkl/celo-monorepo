import { flags } from '@oclif/command';
import { IArg, ParseFn } from '@oclif/parser/lib/args';
import BigNumber from 'bignumber.js';
declare type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
declare type ArgBuilder<T> = (name: string, args?: Partial<Omit<IArg<T>, 'name' | 'parse'>>) => IArg<T>;
export declare function argBuilder<T>(parser: ParseFn<T>): ArgBuilder<T>;
export declare const Flags: {
    address: flags.Definition<string>;
    ecdsaPublicKey: flags.Definition<string>;
    blsPublicKey: flags.Definition<string>;
    blsProofOfPossession: flags.Definition<string>;
    phoneNumber: flags.Definition<string>;
    proofOfPossession: flags.Definition<string>;
    url: flags.Definition<string>;
    wei: flags.Definition<BigNumber>;
};
export declare const Args: {
    address: ArgBuilder<string>;
    file: ArgBuilder<string>;
    newFile: ArgBuilder<string>;
};
export {};
