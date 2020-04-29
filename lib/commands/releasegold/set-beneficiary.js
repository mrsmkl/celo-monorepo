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
const command_1 = require("@oclif/command");
const prompts_1 = __importDefault(require("prompts"));
const checks_1 = require("../../utils/checks");
const cli_1 = require("../../utils/cli");
const command_2 = require("../../utils/command");
const release_gold_1 = require("./release-gold");
class SetBeneficiary extends release_gold_1.ReleaseGoldCommand {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line
            const { flags } = this.parse(SetBeneficiary);
            const newBeneficiary = flags.beneficiary;
            const owner = yield this.releaseGoldWrapper.getOwner();
            const releaseGoldMultiSig = yield this.kit.contracts.getMultiSig(owner);
            yield checks_1.newCheckBuilder(this)
                .isMultiSigOwner(flags.from, releaseGoldMultiSig)
                .runChecks();
            if (!flags.yesreally) {
                const response = yield prompts_1.default({
                    type: 'confirm',
                    name: 'confirmation',
                    message: "Are you sure you want to set a new beneficiary? This will forfeit the current beneficiary's controls. (y/n)",
                });
                if (!response.confirmation) {
                    console.info('Aborting due to user response');
                    process.exit(0);
                }
            }
            const currentBeneficiary = yield this.releaseGoldWrapper.getBeneficiary();
            const setBeneficiaryTx = this.releaseGoldWrapper.setBeneficiary(newBeneficiary);
            const setBeneficiaryMultiSigTx = yield releaseGoldMultiSig.submitOrConfirmTransaction(this.contractAddress, setBeneficiaryTx.txo);
            yield cli_1.displaySendTx('setBeneficiary', setBeneficiaryMultiSigTx, { from: flags.from }, 'BeneficiarySet');
            const replaceOwnerTx = releaseGoldMultiSig.replaceOwner(currentBeneficiary, newBeneficiary);
            const replaceOwnerMultiSigTx = yield releaseGoldMultiSig.submitOrConfirmTransaction(releaseGoldMultiSig.address, replaceOwnerTx.txo);
            yield cli_1.displaySendTx('replaceMultiSigOwner', replaceOwnerMultiSigTx, { from: flags.from });
        });
    }
}
exports.default = SetBeneficiary;
SetBeneficiary.description = "Set the beneficiary of the ReleaseGold contract. This command is gated via a multi-sig, so this is expected to be called twice: once by the contract's beneficiary and once by the contract's releaseOwner. Once both addresses call this command with the same parameters, the tx will execute.";
SetBeneficiary.flags = Object.assign(Object.assign({}, release_gold_1.ReleaseGoldCommand.flags), { from: command_2.Flags.address({
        required: true,
        description: 'Address to submit multisig transaction from (one of the owners)',
    }), beneficiary: command_2.Flags.address({
        required: true,
        description: 'Address of the new beneficiary',
    }), yesreally: command_1.flags.boolean({
        description: 'Override prompt to set new beneficiary (be careful!)',
    }) });
SetBeneficiary.args = [];
SetBeneficiary.examples = [
    'set-beneficiary --contract 0x5409ED021D9299bf6814279A6A1411A7e866A631 --from 0xE36Ea790bc9d7AB70C55260C66D52b1eca985f84 --beneficiary 0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb',
];
//# sourceMappingURL=set-beneficiary.js.map