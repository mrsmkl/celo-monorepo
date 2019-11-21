import { getHooks, sleep } from './e2e-tests/utils'

async function main() {
  const gethConfig = {
    migrate: true,
    instances: [
      {
        name: 'validator',
        validating: true,
        syncmode: 'full',
        port: 30303,
        rpcport: 8545,
        wsport: 8546,
      },
    ],
  }
  const hooks = getHooks(gethConfig)
  await hooks.before()
  await sleep(10)
  console.debug('going to restart')
  await hooks.restart()
  await sleep(100000)
}

main()
