import { createSelector } from 'reselect'
import { getPaymentRequests } from 'src/account/selectors'
import { CHECK_INTERVALS, DAYS_TO_BACKUP, DAYS_TO_DELAY } from 'src/backup/Backup'
import { BALANCE_OUT_OF_SYNC_THRESHOLD } from 'src/config'
import { isGethConnectedSelector } from 'src/geth/reducer'
import { RootState } from 'src/redux/reducers'
import { timeDeltaInDays, timeDeltaInSeconds } from 'src/utils/time'

export const disabledDueToNoBackup = (
  accountCreationTime: number,
  backupCompleted: boolean,
  backupDelayedTime: number
) => {
  const disableThreshold = backupDelayedTime ? DAYS_TO_DELAY : DAYS_TO_BACKUP
  const startTime = backupDelayedTime || accountCreationTime
  return timeDeltaInDays(Date.now(), startTime) > disableThreshold && !backupCompleted
}

export const isBackupTooLate = (state: RootState) => {
  return disabledDueToNoBackup(
    state.account.accountCreationTime,
    state.account.backupCompleted,
    state.account.backupDelayedTime
  )
}

export const disabledDueToNoCheck = (
  backupCompleted: boolean,
  lastBackupCheck: number,
  checkStep: number
) => {
  if (!backupCompleted || checkStep >= CHECK_INTERVALS.length) {
    return false
  }

  return timeDeltaInDays(Date.now(), lastBackupCheck) > CHECK_INTERVALS[checkStep]
}

export const isCheckTooLate = (state: RootState) => {
  return disabledDueToNoCheck(
    state.account.backupCompleted,
    state.account.backupCheck.lastCheck,
    state.account.backupCheck.checkStep
  )
}

export const getNetworkConnected = (state: RootState) => state.networkInfo.connected

export const isAppConnected = createSelector(
  isGethConnectedSelector,
  getNetworkConnected,
  (gethConnected, networkConnected) => gethConnected && networkConnected
)

export const getTabBarActiveNotification = createSelector(
  isBackupTooLate,
  getPaymentRequests,
  (tooLate, paymentRequests) => tooLate || Boolean(paymentRequests.length)
)

export const goldTokenLastFetch = (state: RootState) => state.goldToken.lastFetch || 0
export const stableTokenLastFetch = (state: RootState) => state.stableToken.lastFetch || 0

export const lastFetchTooOld = (lastFetch: number) => {
  // if lastFetch is null, then skip
  return !!lastFetch && timeDeltaInSeconds(Date.now(), lastFetch) > BALANCE_OUT_OF_SYNC_THRESHOLD
}

export const areAllBalancesFresh = (state: RootState) =>
  lastFetchTooOld(goldTokenLastFetch(state)) || lastFetchTooOld(stableTokenLastFetch(state))

// isAppConnected is used to either show the "disconnected banner" or "Refresh balance"
// but not both at the same time
export const shouldUpdateBalance = (state: RootState) =>
  areAllBalancesFresh(state) && isAppConnected(state)
