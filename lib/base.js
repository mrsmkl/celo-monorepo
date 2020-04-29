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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contractkit_1 = require("@celo/contractkit");
const provider_utils_1 = require("@celo/contractkit/lib/utils/provider-utils");
const azure_hsm_wallet_1 = require("@celo/contractkit/lib/wallets/azure-hsm-wallet");
const ledger_wallet_1 = require("@celo/contractkit/lib/wallets/ledger-wallet");
const hw_transport_node_hid_1 = __importDefault(require("@ledgerhq/hw-transport-node-hid"));
const command_1 = require("@oclif/command");
const net_1 = __importDefault(require("net"));
const web3_1 = __importDefault(require("web3"));
const config_1 = require("./utils/config");
const helpers_1 = require("./utils/helpers");
// Base for commands that do not need web3.
class LocalCommand extends command_1.Command {
    // TODO(yorke): implement log(msg) switch on logLevel with chalk colored output
    log(msg, logLevel = 'info') {
        if (logLevel === 'info') {
            console.debug(msg);
        }
        else if (logLevel === 'error') {
            console.error(msg);
        }
    }
}
exports.LocalCommand = LocalCommand;
LocalCommand.flags = {
    logLevel: command_1.flags.string({ char: 'l', hidden: true }),
    help: command_1.flags.help({ char: 'h', hidden: true }),
    truncate: command_1.flags.boolean({
        default: true,
        hidden: true,
        allowNo: true,
        description: 'Truncate fields to fit line',
    }),
};
// tslint:disable-next-line:max-classes-per-file
class BaseCommand extends LocalCommand {
    constructor() {
        super(...arguments);
        // This specifies whether the node needs to be synced before the command
        // can be run. In most cases, this should be `true`, so that's the default.
        // For commands that don't require the node is synced, add the following line
        // to its definition:
        //   requireSynced = false
        this.requireSynced = true;
        this._web3 = null;
        this._kit = null;
    }
    static flagsWithoutLocalAddresses() {
        return Object.assign(Object.assign({}, BaseCommand.flags), { privateKey: command_1.flags.string({ hidden: true }), useLedger: command_1.flags.boolean({ hidden: true }), ledgerAddresses: command_1.flags.integer({ hidden: true, default: 1 }), ledgerCustomAddresses: command_1.flags.string({ hidden: true, default: '[0]' }), ledgerConfirmAddress: command_1.flags.boolean({ hidden: true }) });
    }
    get web3() {
        if (!this._web3) {
            const res = this.parse();
            const nodeUrl = (res.flags && res.flags.node) || config_1.getNodeUrl(this.config.configDir);
            this._web3 =
                nodeUrl && nodeUrl.endsWith('.ipc')
                    ? new web3_1.default(new web3_1.default.providers.IpcProvider(nodeUrl, net_1.default))
                    : new web3_1.default(nodeUrl);
        }
        return this._web3;
    }
    get kit() {
        if (!this._kit) {
            this._kit = contractkit_1.newKitFromWeb3(this.web3, this._wallet);
        }
        const res = this.parse();
        if (res.flags && res.flags.privateKey && !res.flags.useLedger && !res.flags.useAKV) {
            this._kit.addAccount(res.flags.privateKey);
        }
        return this._kit;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.requireSynced) {
                yield helpers_1.requireNodeIsSynced(this.web3);
            }
            const res = this.parse();
            if (res.flags.useLedger) {
                let transport;
                try {
                    transport = yield hw_transport_node_hid_1.default.open('');
                    const derivationPathIndexes = res.raw.some((value) => value.flag === 'ledgerCustomAddresses')
                        ? JSON.parse(res.flags.ledgerCustomAddresses)
                        : Array.from(Array(res.flags.ledgerAddresses).keys());
                    console.log('Retrieving derivation Paths', derivationPathIndexes);
                    let ledgerConfirmation = ledger_wallet_1.AddressValidation.never;
                    if (res.flags.ledgerConfirmAddress) {
                        ledgerConfirmation = ledger_wallet_1.AddressValidation.everyTransaction;
                    }
                    this._wallet = yield ledger_wallet_1.newLedgerWalletWithSetup(transport, derivationPathIndexes, undefined, ledgerConfirmation);
                }
                catch (err) {
                    console.log('Check if the ledger is connected and logged.');
                    throw err;
                }
            }
            else if (res.flags.useAKV) {
                try {
                    const akvWallet = yield new azure_hsm_wallet_1.AzureHSMWallet(res.flags.azureVaultName);
                    yield akvWallet.init();
                    console.log(`Found addresses: ${yield akvWallet.getAccounts()}`);
                    this._wallet = akvWallet;
                }
                catch (err) {
                    console.log(`Failed to connect to AKV ${err}`);
                    throw err;
                }
            }
        });
    }
    finally(arg) {
        try {
            provider_utils_1.stopProvider(this.web3.currentProvider);
        }
        catch (error) {
            this.log(`Failed to close the connection: ${error}`);
        }
        return super.finally(arg);
    }
}
exports.BaseCommand = BaseCommand;
BaseCommand.flags = Object.assign(Object.assign({}, LocalCommand.flags), { privateKey: command_1.flags.string({ hidden: true }), node: command_1.flags.string({ char: 'n', hidden: true }), useLedger: command_1.flags.boolean({
        default: false,
        hidden: false,
        description: 'Set it to use a ledger wallet',
    }), ledgerAddresses: command_1.flags.integer({
        default: 1,
        hidden: false,
        exclusive: ['ledgerCustomAddresses'],
        description: 'If --useLedger is set, this will get the first N addresses for local signing',
    }), ledgerCustomAddresses: command_1.flags.string({
        default: '[0]',
        hidden: false,
        exclusive: ['ledgerAddresses'],
        description: 'If --useLedger is set, this will get the array of index addresses for local signing. Example --ledgerCustomAddresses "[4,99]"',
    }), useAKV: command_1.flags.boolean({
        default: false,
        hidden: true,
        description: 'Set it to use an Azure KeyVault HSM',
    }), azureVaultName: command_1.flags.string({
        hidden: true,
        description: 'If --useAKV is set, this is used to connect to the Azure KeyVault',
    }), ledgerConfirmAddress: command_1.flags.boolean({
        default: false,
        hidden: false,
        description: 'Set it to ask confirmation for the address of the transaction from the ledger',
    }) });
//# sourceMappingURL=base.js.map