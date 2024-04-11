import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import { Provider } from 'react-redux'
import configStore from './store'
import './app.less'

const store = configStore()

function App({ children }: PropsWithChildren<any>) {

  useLaunch(()=>{
    console.log('初始化云盘')
  })

      return (
        <Provider store={store}>
          {children}
        </Provider>
        )
    

}

export default App
