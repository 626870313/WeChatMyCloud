import { useDispatch, useSelector } from 'react-redux'
import { SET_IS_HIDE, SET_UN_HIDE } from '../constants/navigationbar'

const isShow = useSelector((state: any) => state)
const dispatch = useDispatch()

export const hidebarShow = () => {
  if (!isShow) return
  dispatch({ type: SET_IS_HIDE, payload: { isShow: false } })
}

export const unhidebarShow = () => {
  if (isShow) return
  dispatch({ type: SET_UN_HIDE, payload: { isShow: true } })
}


