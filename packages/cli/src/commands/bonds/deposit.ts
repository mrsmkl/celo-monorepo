import { Address } from '@celo/utils/lib/src/address'
import { flags } from '@oclif/command'
import BigNumber from 'bignumber.js'
import { BaseCommand } from '../../base'
import { BondArgs } from '../../utils/bonds'
import { displaySendTx, failWith } from '../../utils/cli'
import { Flags } from '../../utils/command'

export default class Deposit extends BaseCommand {
  static description = 'Create a bonded deposit given notice period and gold amount'

  static flags = {
    ...BaseCommand.flags,
    from: flags.string({ ...Flags.address, required: true }),
    noticePeriod: flags.string({ ...BondArgs.noticePeriodArg, required: true }),
    goldAmount: flags.string({ ...BondArgs.goldAmountArg, required: true }),
  }

  static args = []

  static examples = [
    'deposit --from 0x47e172F6CfB6c7D01C1574fa3E2Be7CC73269D95 --noticePeriod 8640 --goldAmount 1000000000000000000',
  ]

  async run() {
    const res = this.parse(Deposit)
    const address: Address = res.flags.from

    this.kit.defaultAccount = address
    const bondedDeposits = await this.kit.contracts.getBondedDeposits()

    const noticePeriod = new BigNumber(res.flags.noticePeriod)
    const goldAmount = new BigNumber(res.flags.goldAmount)

    if (!(await bondedDeposits.isVoting(address))) {
      failWith(`require(!isVoting(address)) => false`)
    }

    const maxNoticePeriod = await bondedDeposits.maxNoticePeriod()
    if (!maxNoticePeriod.gte(noticePeriod)) {
      failWith(`require(noticePeriod <= maxNoticePeriod) => [${noticePeriod}, ${maxNoticePeriod}]`)
    }
    if (!goldAmount.gt(new BigNumber(0))) {
      failWith(`require(goldAmount > 0) => [${goldAmount}]`)
    }

    // await displaySendTx('redeemRewards', bondedDeposits.methods.redeemRewards())
    const tx = bondedDeposits.deposit(noticePeriod.toString())
    await displaySendTx('deposit', tx, { value: goldAmount.toString() })
  }
}
