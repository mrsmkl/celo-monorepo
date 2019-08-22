import { BaseCommand } from '../../base'
import { displaySendTx } from '../../utils/cli'
import { Flags } from '../../utils/command'

export default class Register extends BaseCommand {
  static description = 'Register an account for bonded deposit eligibility'

  static flags = {
    ...BaseCommand.flags,
    from: Flags.address({ required: true }),
  }

  static args = []

  static examples = ['register']

  async run() {
    const res = this.parse(Register)
    this.kit.defaultAccount = res.flags.from
    const bondedDeposits = await this.kit.contracts.getBondedDeposits()
    await displaySendTx('register', bondedDeposits.createAccount())
  }
}
