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
const register_1 = __importDefault(require("../account/register"));
const lock_1 = __importDefault(require("../lockedgold/lock"));
const commission_1 = __importDefault(require("./commission"));
const register_2 = __importDefault(require("./register"));
process.env.NO_SYNCCHECK = 'true';
ganache_test_1.testWithGanache('validatorgroup:comission cmd', (web3) => {
    function registerValidatorGroup() {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield web3.eth.getAccounts();
            yield register_1.default.run(['--from', accounts[0]]);
            yield lock_1.default.run(['--from', accounts[0], '--value', '10000000000000000000000']);
            yield register_2.default.run(['--from', accounts[0], '--commission', '0.1', '--yes']);
        });
    }
    test('can queue update', () => __awaiter(void 0, void 0, void 0, function* () {
        const accounts = yield web3.eth.getAccounts();
        yield registerValidatorGroup();
        yield commission_1.default.run(['--from', accounts[0], '--queue-update', '0.2']);
    }));
    test('can apply update', () => __awaiter(void 0, void 0, void 0, function* () {
        const accounts = yield web3.eth.getAccounts();
        yield registerValidatorGroup();
        yield commission_1.default.run(['--from', accounts[0], '--queue-update', '0.2']);
        yield ganache_test_1.mineBlocks(3, web3);
        yield commission_1.default.run(['--from', accounts[0], '--apply']);
    }));
});
//# sourceMappingURL=commission.test.js.map