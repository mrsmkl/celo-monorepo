import { ContractKit, newKitFromWeb3, NULL_ADDRESS } from '@celo/contractkit'
// import BigNumber from 'bignumber.js'
import { getBlsPoP, getBlsPublicKey } from '@celo/utils/lib/bls'
import Web3 from 'web3'
import fs from 'fs'
import * as rlp from 'rlp'
import { ensureLeading0x } from '@celo/utils/lib/address'
// import { parseSignature } from '@celo/utils/lib/signatureUtils'
import { range, repeat } from 'lodash'

export interface Validator {
  address: string
  blsPublicKey: string
  balance: string
}

function headerArray(web3: Web3, block: any) {
  return [
    block.parentHash,
    block.sha3Uncles,
    block.miner,
    block.stateRoot,
    block.transactionsRoot,
    block.receiptsRoot,
    block.logsBloom,
    web3.utils.toHex(block.difficulty),
    block.number,
    block.gasLimit,
    block.gasUsed,
    block.timestamp,
    block.extraData,
    block.mixHash,
    block.nonce,
  ]
}

function headerFromBlock(web3: Web3, block: any) {
  return ensureLeading0x(rlp.encode(headerArray(web3, block)).toString('hex'))
}

const LEADERBOARD_WEB3 = process.env['LEADERBOARD_WEB3'] || 'http://localhost:8545'

// Just have to make elections with ton of validators
// It will get stuck but that doesn't matter???
const pad = (a: string) => {
  let res = a
  while (res.length < 42) {
    res = res + 'f'
  }
  return res
}

async function main() {
  const web3 = new Web3(LEADERBOARD_WEB3)
  const kit: ContractKit = newKitFromWeb3(web3)
  const token = await kit.contracts.getStableToken()
  const bn = await web3.eth.getBlockNumber()
  const accounts = await web3.eth.getAccounts()
  /*
  const c = await kit._web3Contracts.getEpochRewards()
  await c.methods.calculateTargetEpochRewards().call()
  const c = await kit._web3Contracts.getBlockchainParameters()
  await c.methods.intrinsicGasForAlternativeFeeCurrency().call()
  token.balanceOf(NULL_ADDRESS)
  const c = await kit._web3Contracts.getSortedOracles()
  await c.methods.medianRate(token.address).call()
  const c = await kit._web3Contracts.getFeeCurrencyWhitelist()
  console.log(await c.methods.getWhitelist().call())
  const c = await kit._web3Contracts.getElection()
  console.log(await c.methods.getGroupEpochRewards("0x8c308a90AD16a5913F1658352d1aCB20Ffc1C0c7", "100000000000000", ["1000000000000000"]).call())
  const c = await kit._web3Contracts.getGasPriceMinimum()
  console.log(await c.methods.getUpdatedGasPriceMinimum("1000000", "100000000").call())
  const c = await kit._web3Contracts.getRandom()
  console.log(await c.methods.getBlockRandomness(bn-10).call())
  const c = await kit._web3Contracts.getValidators()
  console.log(await c.methods.getRegisteredValidatorSigners().call())
  const c = await kit._web3Contracts.getTransferWhitelist()
  await c.methods.setWhitelist(lst).send({from: accounts[0], gas: "20000000"})
  const c = await kit._web3Contracts.getValidators()
  console.log(await c.methods.updateValidatorScoreFromSigner("0xFd571F62293bBc9CD434Cf37EFcf0FED8917eA64", "287382782738237").call())
  console.log(await c.methods.getWhitelist().call())
  const c = await kit._web3Contracts.getValidators()
  console.log(await c.methods.distributeEpochPaymentsFromSigner("0xFd571F62293bBc9CD434Cf37EFcf0FED8917eA64", "287382782738237").call())
  const c = await kit._web3Contracts.getReserve()
  console.log(await c.methods.getReserveRatio().call())
  const c = await kit._web3Contracts.getStableToken()
  console.log(await c.methods.debugUpdatedInflationFactor().call())
  console.log(await c.methods.creditGasFees(accounts[0],accounts[0],accounts[0],accounts[0], 123, 234,456, 566).call())
   */

  const lst: string[] = []
  for (let i = 0; i < 900; i++) {
    lst.push(pad('0x' + i))
  }
  const c = await kit._web3Contracts.getStableToken()
  // @ts-ignore
  console.log(await c.methods.debugUpdatedInflationFactor().call())
}

async function main1() {
  const web3 = new Web3(LEADERBOARD_WEB3)
  const accounts = await web3.eth.getAccounts()

  const current = await web3.eth.getBlockNumber()
  const block = await web3.eth.getBlock(current)
  const header = headerFromBlock(web3, block)

  const longHeader = fs
    .readFileSync('header')
    .toString()
    .trim()

  /*
  let longest = ""
  for (let i = 0; i < 100; i++) {
    let header = headerFromBlock(web3, await web3.eth.getBlock(720*i))
    console.log(720*i, header)
    if (header.length > longest.length) {
      longest = header
    }
  }
  console.log("longest", longest)
  process.exit()
  */

  const { abi, bytecode, contractName } = JSON.parse(
    fs.readFileSync('../protocol/build/contracts/Benchmark.json').toString()
  )
  console.log('deploying contract', contractName)
  let bench = new web3.eth.Contract(abi)
  bench = await bench.deploy({ data: bytecode }).send({ from: accounts[0], gas: 10000000 })

  console.log('deployed to', bench.options.address)

  const { address, privateKey } = web3.eth.accounts.create()
  const blsPublicKey = getBlsPublicKey(privateKey)
  const blsPop = getBlsPoP(address, privateKey)

  const kit: ContractKit = newKitFromWeb3(web3)

  // verifyaggregated seal takes like 5ms for one validator

  for (let i = 0; i < 100; i++) {
    await bench.methods.addList(50, i).send({ from: accounts[0], gas: '10000000' })
    const lst = await bench.methods.getList().call({ gas: '20000000' })
    console.log(lst.length)
  }

  /*
  await bench.methods.baseline(100000).call()
  await bench.methods.baselineHash(100000).call()
  await bench.methods.benchFraction(10000, 10, 10).call()
  await bench.methods.benchFraction(10000, 50, 10).call()
  await bench.methods.benchFraction(1000, 100, 10).call()
  await bench.methods.benchFraction(1000, 200, 10).call()
  await bench.methods.benchFraction(1000, 400, 10).call()
  await bench.methods.benchFraction(1000, 800, 10).call()
  await bench.methods.benchFraction(100, 1600, 10).call()
  await bench.methods.benchFraction(100, 3200, 10).call()
  await bench.methods.benchFraction(100, 6400, 10).call()
  await bench.methods.benchFraction(10, 12800, 10).call()
  await bench.methods.benchFraction(10, 25600, 10).call()
  await bench.methods.benchFraction(10, 51200, 10).call()
  */

  for (let i = 0; i < 10; i++) {
    /*
    await bench.methods.baseline(100000).call()
    await bench.methods.baselineHash(100000).call()
    await bench.methods.benchHashHeader(10000, header).call()
    await bench.methods.benchHashHeader(1000, longHeader).call()
    await bench.methods.benchEpochsize(10000).call()
    await bench.methods.benchNumValidators(10000).call()
    await bench.methods.benchGetValidator(10000).call()
    await bench.methods.benchParentSeal(10000).call()
    await bench.methods.benchPoP(1000, address, blsPublicKey, blsPop).call()
    await bench.methods.benchReadHeader(10000, header).call()
    await bench.methods.benchReadHeader(1000, longHeader).call()
    await bench.methods.benchReadSealHeader(1000, header).call()
    await bench.methods.benchReadSealHeader(100, longHeader).call()
    */
  }
}

main()
