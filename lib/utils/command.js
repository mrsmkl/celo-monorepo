"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = require("@celo/utils/lib/address");
const bls_1 = require("@celo/utils/lib/bls");
const io_1 = require("@celo/utils/lib/io");
const phoneNumbers_1 = require("@celo/utils/lib/phoneNumbers");
const signatureUtils_1 = require("@celo/utils/lib/signatureUtils");
const command_1 = require("@oclif/command");
const errors_1 = require("@oclif/errors");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const fs_extra_1 = require("fs-extra");
const web3_1 = __importDefault(require("web3"));
const parseBytes = (input, length, msg) => {
    // Check that the string is hex and and has byte length of `length`.
    const expectedLength = input.startsWith('0x') ? length * 2 + 2 : length * 2;
    if (web3_1.default.utils.isHex(input) && input.length === expectedLength) {
        return address_1.ensureLeading0x(input);
    }
    else {
        throw new errors_1.CLIError(msg);
    }
};
const parseEcdsaPublicKey = (input) => {
    const stripped = address_1.trimLeading0x(input);
    // ECDSA public keys may be passed as 65 byte values. When this happens, we drop the first byte.
    if (stripped.length === 65 * 2) {
        return parseBytes(stripped.slice(2), 64, `${input} is not an ECDSA public key`);
    }
    else {
        return parseBytes(input, 64, `${input} is not an ECDSA public key`);
    }
};
const parseBlsPublicKey = (input) => {
    return parseBytes(input, bls_1.BLS_PUBLIC_KEY_SIZE, `${input} is not a BLS public key`);
};
const parseBlsProofOfPossession = (input) => {
    return parseBytes(input, bls_1.BLS_POP_SIZE, `${input} is not a BLS proof-of-possession`);
};
const parseProofOfPossession = (input) => {
    return parseBytes(input, signatureUtils_1.POP_SIZE, `${input} is not a proof-of-possession`);
};
const parseAddress = (input) => {
    if (web3_1.default.utils.isAddress(input)) {
        return input;
    }
    else {
        throw new errors_1.CLIError(`${input} is not a valid address`);
    }
};
const parseWei = (input) => {
    try {
        return new bignumber_js_1.default(input);
    }
    catch (_err) {
        throw new errors_1.CLIError(`${input} is not a valid token amount`);
    }
};
const parsePath = (input) => {
    if (fs_extra_1.pathExistsSync(input)) {
        return input;
    }
    else {
        throw new errors_1.CLIError(`File at "${input}" does not exist`);
    }
};
const parsePhoneNumber = (input) => {
    if (phoneNumbers_1.isE164NumberStrict(input)) {
        return input;
    }
    else {
        throw new errors_1.CLIError(`PhoneNumber "${input}" is not a valid E164 number`);
    }
};
const parseUrl = (input) => {
    if (io_1.URL_REGEX.test(input)) {
        return input;
    }
    else {
        throw new errors_1.CLIError(`"${input}" is not a valid URL`);
    }
};
function argBuilder(parser) {
    return (name, args) => (Object.assign(Object.assign({ name }, args), { required: true, parse: parser }));
}
exports.argBuilder = argBuilder;
exports.Flags = {
    address: command_1.flags.build({
        parse: parseAddress,
        description: 'Account Address',
        helpValue: '0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d',
    }),
    ecdsaPublicKey: command_1.flags.build({
        parse: parseEcdsaPublicKey,
        description: 'ECDSA Public Key',
        helpValue: '0x',
    }),
    blsPublicKey: command_1.flags.build({
        parse: parseBlsPublicKey,
        description: 'BLS Public Key',
        helpValue: '0x',
    }),
    blsProofOfPossession: command_1.flags.build({
        parse: parseBlsProofOfPossession,
        description: 'BLS Proof-of-Possession',
        helpValue: '0x',
    }),
    phoneNumber: command_1.flags.build({
        parse: parsePhoneNumber,
        description: 'Phone Number in E164 Format',
        helpValue: '+14152223333',
    }),
    proofOfPossession: command_1.flags.build({
        parse: parseProofOfPossession,
        description: 'Proof-of-Possession',
        helpValue: '0x',
    }),
    url: command_1.flags.build({
        parse: parseUrl,
        description: 'URL',
        helpValue: 'https://www.celo.org',
    }),
    wei: command_1.flags.build({
        parse: parseWei,
        description: 'Token value without decimals',
        helpValue: '10000000000000000000000',
    }),
};
exports.Args = {
    address: argBuilder(parseAddress),
    file: argBuilder(parsePath),
    // TODO: Check that the file path is possible
    newFile: argBuilder((x) => x),
};
//# sourceMappingURL=command.js.map