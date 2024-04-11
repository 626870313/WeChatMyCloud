import { View, Text } from '@tarojs/components'
import { Progress } from '@antmjs/vantui'
import { useEffect } from 'react'


export default function ProgressPop(props: any) {
  const { showProgress,upProgress,upCount,upCom,setShowProgress } = props
  
  useEffect(()=>{
    if(upCom){
      setTimeout(()=>{
        setShowProgress(false)
      },2000)
    }
  },[upCom])

  return (
    <>
      {showProgress ? <View className='fixed w-full bottom-0 bg-gray-50'>
        <View className='p-3.5'>
          <Text>{upCom ? '上传已完成 · 共' + upCount + '项' : '正在上传，请勿离开小程序 · 剩余' + upCount + '项'}</Text>
        </View>
        <Progress percentage={upProgress} pivotText=' ' strokeWidth="10" color="#9fe7ff" />

      </View> : null}
    </>
  )
}