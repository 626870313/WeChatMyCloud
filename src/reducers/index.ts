import { combineReducers } from 'redux'
import user  from './user'
import navigationbar  from './navigationbar'

export default combineReducers({
  user,
  navigationbar
})