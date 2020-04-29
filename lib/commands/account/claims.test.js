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
const identity_1 = require("@celo/contractkit/lib/identity");
const ganache_test_1 = require("@celo/dev-utils/lib/ganache-test");
const fs_1 = require("fs");
const os_1 = require("os");
const claim_account_1 = __importDefault(require("./claim-account"));
const claim_domain_1 = __importDefault(require("./claim-domain"));
const claim_name_1 = __importDefault(require("./claim-name"));
const create_metadata_1 = __importDefault(require("./create-metadata"));
const register_metadata_1 = __importDefault(require("./register-metadata"));
process.env.NO_SYNCCHECK = 'true';
ganache_test_1.testWithGanache('account metadata cmds', (web3) => {
    let account;
    let accounts;
    let kit;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        accounts = yield web3.eth.getAccounts();
        kit = contractkit_1.newKitFromWeb3(web3);
        account = accounts[0];
    }));
    describe('Modifying the metadata file', () => {
        const emptyFilePath = `${os_1.tmpdir()}/metadata.json`;
        const generateEmptyMetadataFile = () => {
            fs_1.writeFileSync(emptyFilePath, contractkit_1.IdentityMetadataWrapper.fromEmpty(account));
        };
        const readFile = () => {
            return contractkit_1.IdentityMetadataWrapper.fromFile(kit, emptyFilePath);
        };
        test('account:create-metadata cmd', () => __awaiter(void 0, void 0, void 0, function* () {
            const newFilePath = `${os_1.tmpdir()}/newfile.json`;
            yield create_metadata_1.default.run(['--from', account, newFilePath]);
            const res = JSON.parse(fs_1.readFileSync(newFilePath).toString());
            expect(res.meta.address).toEqual(account);
        }));
        test('account:claim-name cmd', () => __awaiter(void 0, void 0, void 0, function* () {
            generateEmptyMetadataFile();
            const name = 'myname';
            yield claim_name_1.default.run(['--from', account, '--name', name, emptyFilePath]);
            const metadata = yield readFile();
            const claim = metadata.findClaim(identity_1.ClaimTypes.NAME);
            expect(claim).toBeDefined();
            expect(claim.name).toEqual(name);
        }));
        test('account:claim-domain cmd', () => __awaiter(void 0, void 0, void 0, function* () {
            generateEmptyMetadataFile();
            const domain = 'test.com';
            yield claim_domain_1.default.run(['--from', account, '--domain', domain, emptyFilePath]);
            const metadata = yield readFile();
            const claim = metadata.findClaim(identity_1.ClaimTypes.DOMAIN);
            expect(claim).toBeDefined();
            expect(claim.domain).toEqual(domain);
        }));
        test('account:claim-account cmd', () => __awaiter(void 0, void 0, void 0, function* () {
            generateEmptyMetadataFile();
            const otherAccount = accounts[1];
            yield claim_account_1.default.run(['--from', account, '--address', otherAccount, emptyFilePath]);
            const metadata = yield readFile();
            const claim = metadata.findClaim(identity_1.ClaimTypes.ACCOUNT);
            expect(claim).toBeDefined();
            expect(claim.address).toEqual(otherAccount);
        }));
    });
    describe('account:register-metadata cmd', () => {
        describe('when the account is registered', () => {
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                const accountsInstance = yield kit.contracts.getAccounts();
                yield accountsInstance.createAccount().sendAndWaitForReceipt({ from: account });
            }));
            test('can register metadata', () => __awaiter(void 0, void 0, void 0, function* () {
                yield register_metadata_1.default.run(['--force', '--from', account, '--url', 'https://test.com']);
            }));
            test('fails if url is missing', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(register_metadata_1.default.run(['--force', '--from', account])).rejects.toThrow('Missing required flag');
            }));
        });
        it('cannot register metadata', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(register_metadata_1.default.run(['--force', '--from', account, '--url', 'https://test.com'])).rejects.toThrow("Some checks didn't pass!");
        }));
    });
});
//# sourceMappingURL=claims.test.js.map