import { Actions, ActionTypes } from 'src/stableToken/actions'

export interface State {
  balance: string | null
  lastFetch: number | null
}

export const initialState = {
  balance: null,
  lastFetch: null,
}

export const reducer = (state: State | undefined = initialState, action: ActionTypes): State => {
  switch (action.type) {
    case Actions.SET_BALANCE:
      return {
        ...state,
        balance: action.balance,
        lastFetch: Date.now(),
      }
    default:
      return state
  }
}
