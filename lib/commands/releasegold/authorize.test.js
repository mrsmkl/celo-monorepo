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
const ganache_test_1 = require("@celo/dev-utils/lib/ganache-test");
const signatureUtils_1 = require("@celo/utils/lib/signatureUtils");
const register_1 = __importDefault(require("../validator/register"));
const authorize_1 = __importDefault(require("./authorize"));
const create_account_1 = __importDefault(require("./create-account"));
const locked_gold_1 = __importDefault(require("./locked-gold"));
process.env.NO_SYNCCHECK = 'true';
ganache_test_1.testWithGanache('releasegold:authorize cmd', (web3) => {
    let contractAddress;
    let kit;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const contractCanValidate = true;
        contractAddress = yield ganache_test_1.getContractFromEvent('ReleaseGoldInstanceCreated(address,address)', web3, contractCanValidate);
        kit = contractkit_1.newKitFromWeb3(web3);
        yield create_account_1.default.run(['--contract', contractAddress]);
    }));
    describe('can authorize account signers', () => {
        let pop;
        let accounts;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            accounts = yield web3.eth.getAccounts();
            const accountsWrapper = yield kit.contracts.getAccounts();
            pop = yield accountsWrapper.generateProofOfKeyPossession(contractAddress, accounts[1]);
        }));
        test('can authorize account vote signer ', () => __awaiter(void 0, void 0, void 0, function* () {
            yield authorize_1.default.run([
                '--contract',
                contractAddress,
                '--role',
                'vote',
                '--signer',
                accounts[1],
                '--signature',
                signatureUtils_1.serializeSignature(pop),
            ]);
        }));
        test('can authorize account validator signer', () => __awaiter(void 0, void 0, void 0, function* () {
            yield authorize_1.default.run([
                '--contract',
                contractAddress,
                '--role',
                'validator',
                '--signer',
                accounts[1],
                '--signature',
                signatureUtils_1.serializeSignature(pop),
            ]);
        }));
        test('can authorize account attestation signer', () => __awaiter(void 0, void 0, void 0, function* () {
            yield authorize_1.default.run([
                '--contract',
                contractAddress,
                '--role',
                'attestation',
                '--signer',
                accounts[1],
                '--signature',
                signatureUtils_1.serializeSignature(pop),
            ]);
        }));
    });
    test('can register as a validator from an authorized signer', () => __awaiter(void 0, void 0, void 0, function* () {
        const accounts = yield web3.eth.getAccounts();
        const accountsWrapper = yield kit.contracts.getAccounts();
        const signer = accounts[1];
        const pop = yield accountsWrapper.generateProofOfKeyPossession(contractAddress, signer);
        const ecdsaPublicKey = yield signatureUtils_1.addressToPublicKey(signer, web3.eth.sign);
        yield locked_gold_1.default.run([
            '--contract',
            contractAddress,
            '--action',
            'lock',
            '--value',
            '10000000000000000000000',
        ]);
        yield authorize_1.default.run([
            '--contract',
            contractAddress,
            '--role',
            'validator',
            '--signer',
            signer,
            '--signature',
            signatureUtils_1.serializeSignature(pop),
        ]);
        yield register_1.default.run([
            '--from',
            signer,
            '--ecdsaKey',
            ecdsaPublicKey,
            '--blsKey',
            '0x4fa3f67fc913878b068d1fa1cdddc54913d3bf988dbe5a36a20fa888f20d4894c408a6773f3d7bde11154f2a3076b700d345a42fd25a0e5e83f4db5586ac7979ac2053cd95d8f2efd3e959571ceccaa743e02cf4be3f5d7aaddb0b06fc9aff00',
            '--blsSignature',
            '0xcdb77255037eb68897cd487fdd85388cbda448f617f874449d4b11588b0b7ad8ddc20d9bb450b513bb35664ea3923900',
            '--yes',
        ]);
    }));
    test('can authorize signer with bls keys after registering as validator', () => __awaiter(void 0, void 0, void 0, function* () {
        const accounts = yield web3.eth.getAccounts();
        const accountsWrapper = yield kit.contracts.getAccounts();
        const signer = accounts[1];
        const pop = yield accountsWrapper.generateProofOfKeyPossession(contractAddress, signer);
        const ecdsaPublicKey = yield signatureUtils_1.addressToPublicKey(signer, web3.eth.sign);
        const signerBLS = accounts[2];
        const popBLS = yield accountsWrapper.generateProofOfKeyPossession(contractAddress, signerBLS);
        const newBlsPublicKey = web3.utils.randomHex(96);
        const newBlsPoP = web3.utils.randomHex(48);
        yield locked_gold_1.default.run([
            '--contract',
            contractAddress,
            '--action',
            'lock',
            '--value',
            '10000000000000000000000',
        ]);
        yield authorize_1.default.run([
            '--contract',
            contractAddress,
            '--role',
            'validator',
            '--signer',
            signer,
            '--signature',
            signatureUtils_1.serializeSignature(pop),
        ]);
        yield register_1.default.run([
            '--from',
            signer,
            '--ecdsaKey',
            ecdsaPublicKey,
            '--blsKey',
            '0x4fa3f67fc913878b068d1fa1cdddc54913d3bf988dbe5a36a20fa888f20d4894c408a6773f3d7bde11154f2a3076b700d345a42fd25a0e5e83f4db5586ac7979ac2053cd95d8f2efd3e959571ceccaa743e02cf4be3f5d7aaddb0b06fc9aff00',
            '--blsSignature',
            '0xcdb77255037eb68897cd487fdd85388cbda448f617f874449d4b11588b0b7ad8ddc20d9bb450b513bb35664ea3923900',
            '--yes',
        ]);
        yield authorize_1.default.run([
            '--contract',
            contractAddress,
            '--role',
            'validator',
            '--signer',
            signerBLS,
            '--signature',
            signatureUtils_1.serializeSignature(popBLS),
            '--blsKey',
            newBlsPublicKey,
            '--blsPop',
            newBlsPoP,
        ]);
    }));
    test('fails if contract is not registered as an account', () => __awaiter(void 0, void 0, void 0, function* () {
        const accounts = yield web3.eth.getAccounts();
        yield expect(authorize_1.default.run([
            '--contract',
            contractAddress,
            '--role',
            'validator',
            '--signer',
            accounts[1],
            '--signature',
            '0x1b9fca4bbb5bfb1dbe69ef1cddbd9b4202dcb6b134c5170611e1e36ecfa468d7b46c85328d504934fce6c2a1571603a50ae224d2b32685e84d4d1a1eebad8452eb',
        ])).rejects.toThrow();
    }));
});
//# sourceMappingURL=authorize.test.js.map