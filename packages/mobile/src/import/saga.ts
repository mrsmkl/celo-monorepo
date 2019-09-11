// import { getStableTokenContract } from '@celo/walletkit'
// import BigNumber from 'bignumber.js'
import { mnemonicToSeedHex } from 'react-native-bip39'
import { call, put, spawn, takeLeading } from 'redux-saga/effects'
import { setBackupCompleted } from 'src/account'
import { showError } from 'src/alert/actions'
import { ErrorMessages } from 'src/app/ErrorMessages'
import { refreshAllBalances } from 'src/home/actions'
import { Actions, ImportBackupPhraseAction } from 'src/import/actions'
import { redeemComplete } from 'src/invite/actions'
import { navigateReset } from 'src/navigator/NavigationService'
import { Screens } from 'src/navigator/Screens'
import { setKey } from 'src/utils/keyStore'
// import { web3 } from 'src/web3/contracts'
import { assignAccountFromPrivateKey } from 'src/web3/saga'

export function* importBackupPhraseSaga(action: ImportBackupPhraseAction) {
  const { phrase } = action
  const privateKey = mnemonicToSeedHex(phrase)
  const account = yield call(assignAccountFromPrivateKey, privateKey)
  if (account) {
    yield call(setKey, 'mnemonic', phrase)
    yield put(setBackupCompleted())
    yield put(redeemComplete(true))
    yield put(refreshAllBalances())
    navigateReset(Screens.ImportContacts)
    // TODO:
    // const StableToken = yield call(getStableTokenContract, web3)
    // const accountBalance = new BigNumber(yield call(StableToken.methods.balanceOf(account).call))
    // if (accountBalance.isZero()) {
    //   yield put(showError(ErrorMessages.BACKUP_ZERO_BAL_MESSAGE))
    // }
  } else {
    yield put(showError(ErrorMessages.IMPORT_BACKUP_FAILED))
  }
}

export function* watchImportBackupPhrase() {
  yield takeLeading(Actions.IMPORT_BACKUP_PHRASE, importBackupPhraseSaga)
}

export function* importSaga() {
  yield spawn(watchImportBackupPhrase)
}
