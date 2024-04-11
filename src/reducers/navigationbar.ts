import { SET_IS_HIDE, SET_UN_HIDE } from '../constants/navigationbar'
 
const INITIAL_STATE = {
  isShow: true,
}
 
export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_IS_HIDE: {
      const { isShow } = action.payload
 
      return { ...state, isShow }
    }
 
    case SET_UN_HIDE: {
      const { isShow } = action.payload
 
      return { ...state, isShow }
    }
 
    default:
      return state
  }
}

