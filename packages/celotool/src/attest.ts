import { ContractKit, newKit } from '@celo/contractkit'
import { AttestationsWrapper } from '@celo/contractkit/lib/wrappers/Attestations'

const validatorAddress = '0x47e172f6cfb6c7d01c1574fa3e2be7cc73269d95'
const phoneNumber = '+155555' + Math.floor(Math.random() * 1000000)

async function main() {
  let contractKit: ContractKit
  let Attestations: AttestationsWrapper

  contractKit = newKit('http://localhost:8545')
  contractKit.defaultAccount = validatorAddress
  await contractKit.web3.eth.personal.unlockAccount(validatorAddress, '', 1000000)
  Attestations = await contractKit.contracts.getAttestations()
  const approve = await Attestations.approveAttestationFee(2)
  await approve.sendAndWaitForReceipt()
  const request = await Attestations.request(phoneNumber, 1)
  await request.sendAndWaitForReceipt()

  await Attestations.waitForSelectingIssuers(phoneNumber, validatorAddress)
  const selectIssuers = await Attestations.selectIssuers(phoneNumber)
  await selectIssuers.sendAndWaitForReceipt()

  const stats = await Attestations.getAttestationStat(phoneNumber, validatorAddress)
  console.log(stats)

  const issuers = await Attestations.getAttestationIssuers(phoneNumber, validatorAddress)
  console.log(issuers)
}

main()
