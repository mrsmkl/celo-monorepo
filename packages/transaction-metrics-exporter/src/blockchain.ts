import { ContractKit, newKit } from '@celo/contractkit'
import { newBlockExplorer, ParsedTx } from '@celo/contractkit/lib/explorer/block-explorer'
import { newLogExplorer, ParsedBlock } from '@celo/contractkit/lib/explorer/log-explorer'
import { Future } from '@celo/utils/lib/future'
import { consoleLogger } from '@celo/utils/lib/logger'
import {
  conditionWatcher,
  repeatTask,
  RunningTask,
  tryObtainValueWithRetries,
} from '@celo/utils/lib/task'
import { Block, BlockHeader } from 'web3/eth/types'
import { WebsocketProvider } from 'web3/providers'
import { Counters } from './metrics'

const EMPTY_INPUT = 'empty_input'
const NO_METHOD_ID = 'no_method_id'
const NOT_WHITELISTED_ADDRESS = 'not_whitelisted_address'
const UNKNOWN_METHOD = 'unknown_method'

export function metricExporterWithRestart(providerUrl: string): RunningTask {
  return repeatTask(
    {
      name: 'MetricExporer',
      logger: consoleLogger,
      timeInBetweenMS: 3 * 1000,
    },
    () => metricExporter(providerUrl)
  )
}

export async function metricExporter(providerUrl: string) {
  const kit = await newListeningKit(providerUrl)

  const provider = kit.web3.currentProvider as WebsocketProvider
  const subscription = await kit.web3.eth.subscribe('newBlockHeaders')
  subscription.on('data', await newBlockHeaderProcessor(kit))

  const listeningWatcher = conditionWatcher({
    name: 'check:kit:isListening',
    logger: consoleLogger,
    timeInBetweenMS: 5000,
    initialDelayMS: 5000,
    pollCondition: async () => !(await kit.isListening()),
    onSuccess: () => dispose(new Error('kit is not listening')),
  })

  provider.on('error', ((error: any) => {
    console.error('Error from web3 provider')
    dispose(error)
  }) as any)

  subscription.on('error', (error: any) => {
    console.error('Error occurred during listening')
    dispose(error)
  })

  // Future that is resolved on error (see dispose)
  const endState = new Future<void>()
  const dispose = (error: any) => {
    listeningWatcher.stop()
    ;(subscription as any).unsubscribe()
    provider.removeAllListeners('error')
    // provider.removeAllListeners('close')
    ;(provider as any).disconnect()
    endState.reject(error)
  }

  return endState.asPromise()
}

async function newListeningKit(providerUrl: string): Promise<ContractKit> {
  return tryObtainValueWithRetries({
    name: 'createValidKit',
    logger: consoleLogger,
    maxAttemps: 10,
    timeInBetweenMS: 5000,
    tryGetValue: () => {
      const kit = newKit(providerUrl)
      return kit.isListening().then((isOk) => (isOk ? kit : null))
    },
  }).onValue()
}

const logEvent = (name: string, details: object) =>
  console.log(JSON.stringify({ event: name, ...details }))

async function newBlockHeaderProcessor(kit: ContractKit): Promise<(block: BlockHeader) => void> {
  const blockExplorer = await newBlockExplorer(kit)
  const logExplorer = await newLogExplorer(kit)

  function toMethodId(txInput: string, isKnownCall: boolean): string {
    let methodId: string
    if (txInput === '0x') {
      methodId = EMPTY_INPUT
    } else if (txInput.startsWith('0x')) {
      methodId = isKnownCall ? txInput.slice(0, 10) : UNKNOWN_METHOD
    } else {
      // pretty much should never get here
      methodId = NO_METHOD_ID
    }
    return methodId
  }

  function toTxMap(parsedBlock: ParsedBlock): Map<string, ParsedTx> {
    const parsedTxMap: Map<string, ParsedTx> = new Map()
    parsedBlock.parsedTx.forEach((ptx) => {
      parsedTxMap.set(ptx.tx.hash, ptx)
    })
    return parsedTxMap
  }

  return async (header: BlockHeader) => {
    Counters.blockheader.inc({ miner: header.miner })

    const block = await blockExplorer.fetchBlock(header.number)
    const previousBlock: Block = await blockExplorer.fetchBlock(header.number - 1)

    const blockTime = block.timestamp - previousBlock.timestamp
    logEvent('RECEIVED_BLOCK', { ...block, blockTime })

    const parsedBlock = blockExplorer.parseBlock(block)
    const parsedTxMap = toTxMap(parsedBlock)

    for (const tx of parsedBlock.block.transactions) {
      const parsedTx: ParsedTx | undefined = parsedTxMap.get(tx.hash)

      logEvent('RECEIVED_TRANSACTION', tx)
      const receipt = await kit.web3.eth.getTransactionReceipt(tx.hash)
      logEvent('RECEIVED_TRANSACTION_RECEIPT', receipt)

      const labels = {
        to: parsedTx ? tx.to : NOT_WHITELISTED_ADDRESS,
        methodId: toMethodId(tx.input, parsedTx != null),
        status: receipt.status.toString(),
      }

      Counters.transaction.inc(labels)
      Counters.transactionGasUsed.observe(labels, receipt.gasUsed)
      Counters.transactionLogs.inc(labels, (receipt.logs || []).length)

      if (parsedTx) {
        Counters.parsedTransaction.inc({
          contract: parsedTx.callDetails.contract,
          function: parsedTx.callDetails.function,
        })

        logEvent('RECEIVED_PARSED_TRANSACTION', { ...parsedTx.callDetails, hash: tx.hash })

        for (const event of logExplorer.getKnownLogs(receipt)) {
          Counters.transactionParsedLogs.inc({
            contract: parsedTx.callDetails.contract,
            function: parsedTx.callDetails.function,
            log: event.event,
          })

          logEvent('RECEIVED_PARSED_LOG', event)
        }
      }
    }
  }
}
