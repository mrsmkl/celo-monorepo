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
const ganache_test_1 = require("@celo/dev-utils/lib/ganache-test");
const signatureUtils_1 = require("@celo/utils/lib/signatureUtils");
const register_1 = __importDefault(require("../account/register"));
const lock_1 = __importDefault(require("../lockedgold/lock"));
const register_2 = __importDefault(require("./register"));
process.env.NO_SYNCCHECK = 'true';
ganache_test_1.testWithGanache('validator:register', (web3) => {
    let account;
    let ecdsaPublicKey;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const accounts = yield web3.eth.getAccounts();
        account = accounts[0];
        ecdsaPublicKey = yield signatureUtils_1.addressToPublicKey(account, web3.eth.sign);
        yield register_1.default.run(['--from', account]);
        yield lock_1.default.run(['--from', account, '--value', '10000000000000000000000']);
    }));
    test('can register validator with 0x prefix', () => __awaiter(void 0, void 0, void 0, function* () {
        yield register_2.default.run([
            '--from',
            account,
            '--ecdsaKey',
            ecdsaPublicKey,
            '--blsKey',
            '0x4fa3f67fc913878b068d1fa1cdddc54913d3bf988dbe5a36a20fa888f20d4894c408a6773f3d7bde11154f2a3076b700d345a42fd25a0e5e83f4db5586ac7979ac2053cd95d8f2efd3e959571ceccaa743e02cf4be3f5d7aaddb0b06fc9aff00',
            '--blsSignature',
            '0xcdb77255037eb68897cd487fdd85388cbda448f617f874449d4b11588b0b7ad8ddc20d9bb450b513bb35664ea3923900',
            '--yes',
        ]);
    }));
    test('can register validator without 0x prefix', () => __awaiter(void 0, void 0, void 0, function* () {
        yield register_2.default.run([
            '--from',
            account,
            '--ecdsaKey',
            ecdsaPublicKey,
            '--blsKey',
            '4fa3f67fc913878b068d1fa1cdddc54913d3bf988dbe5a36a20fa888f20d4894c408a6773f3d7bde11154f2a3076b700d345a42fd25a0e5e83f4db5586ac7979ac2053cd95d8f2efd3e959571ceccaa743e02cf4be3f5d7aaddb0b06fc9aff00',
            '--blsSignature',
            'cdb77255037eb68897cd487fdd85388cbda448f617f874449d4b11588b0b7ad8ddc20d9bb450b513bb35664ea3923900',
            '--yes',
        ]);
    }));
    test('fails if validator already registered', () => __awaiter(void 0, void 0, void 0, function* () {
        yield register_2.default.run([
            '--from',
            account,
            '--ecdsaKey',
            ecdsaPublicKey,
            '--blsKey',
            '4fa3f67fc913878b068d1fa1cdddc54913d3bf988dbe5a36a20fa888f20d4894c408a6773f3d7bde11154f2a3076b700d345a42fd25a0e5e83f4db5586ac7979ac2053cd95d8f2efd3e959571ceccaa743e02cf4be3f5d7aaddb0b06fc9aff00',
            '--blsSignature',
            'cdb77255037eb68897cd487fdd85388cbda448f617f874449d4b11588b0b7ad8ddc20d9bb450b513bb35664ea3923900',
            '--yes',
        ]);
        yield expect(register_2.default.run([
            '--from',
            account,
            '--ecdsaKey',
            ecdsaPublicKey,
            '--blsKey',
            '4fa3f67fc913878b068d1fa1cdddc54913d3bf988dbe5a36a20fa888f20d4894c408a6773f3d7bde11154f2a3076b700d345a42fd25a0e5e83f4db5586ac7979ac2053cd95d8f2efd3e959571ceccaa743e02cf4be3f5d7aaddb0b06fc9aff00',
            '--blsSignature',
            'cdb77255037eb68897cd487fdd85388cbda448f617f874449d4b11588b0b7ad8ddc20d9bb450b513bb35664ea3923900',
            '--yes',
        ])).rejects.toThrow("Some checks didn't pass!");
    }));
});
//# sourceMappingURL=register.test.js.map