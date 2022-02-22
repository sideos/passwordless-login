import { AnyAction } from 'redux'

const initialState = {
    token: localStorage.getItem('token'),
  };

export type LoginReducer = typeof initialState
  
export default function loginReducer(state = initialState, action: AnyAction): LoginReducer {
    switch (action.type) {
      case 'STORE_TOKEN': {
        return {
          ...state,
          token: action.payload
        }
      }
      default:
        return state;
    }
  }
  