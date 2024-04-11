import { View, Text, Image } from '@tarojs/components'
import Taro,{ useDidShow } from '@tarojs/taro'
import rightArr from '../../static/iconfont/arrow-right.png'
import './index.less'
import { Icon, Toast, Dialog, Progress } from '@antmjs/vantui'
import { useState } from 'react'
import {getUseSpace} from '../../api/login'

type userInfoType = {
  id:number|null;
  username:string;
  avatar:string;
  space:string;
  useSpace:number
}

export default function detail() {

  const Dialog_ = Dialog.createOnlyDialog()
  const Toast_ = Toast.createOnlyToast()
  const [userInfo,setUserInfo] = useState<userInfoType>({  
    id:null,
    username:'',
    avatar:'',
    space:'',
    useSpace:0
  })
  const [percentage,setPercentage] = useState(0)


  const parseMemorySize = (sizeString)=>{
    const value = parseFloat(sizeString);
    return value * 1024 ** 3;
  }


  useDidShow(()=>{
    loginCheck()
    Taro.getStorage({
      key:'userInfo',
      success: function (res) {
        setUserInfo(res.data)
        getSpace(res.data.space)
      }
    })
  })

  const getSpace = async (space) => {
    const res = await getUseSpace({})
    if (res != null) {
      setUserInfo(origin => ({ ...origin, useSpace: res }))
      const parsedSpace = parseMemorySize(space);
      const calculatedPercentage = (res / parsedSpace) * 100;
      setPercentage(calculatedPercentage);
    }
  }

  const formatFileSize = (size) => {
    if (size) {
      if (size < 1024) {
        return size + "B";
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + "KB";
      } else if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(2) + "MB";
      } else {
        return (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      }
    } else {
      return ''
    }

  }



  const showLong = () => {
    Toast_.show('改昵称已存在')
  }

  const unBind = () => {
    Dialog_.confirm({
      title: '确认解绑账号吗?',
      message: '解绑后将不再自动登录小程序'
    }).then((value)=>{
      if(value==='confirm'){
        Taro.clearStorage()
        Taro.switchTab({
          url:'/pages/index/index',
          complete:()=>{
            Taro.showToast({
              title: '解绑成功成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  }

  const recommend = () => {
    Toast_.show('已收到您的反馈')
  }


  const loginCheck = ()=>{
    try {
      var value = Taro.getStorageSync('token')
      if (value===''||value.length===0) {
        Taro.reLaunch({
          url:'/pages/login/index'
        })
        Taro.showToast({
          title: '请登录',
          icon: 'none',
          duration: 2000
        })
      }
    } catch (e) {
      Taro.showToast({
        title: '请登录',
        icon: 'none',
        duration: 2000
      })
      Taro.reLaunch({
        url:'/pages/login/index'
      })
    }
  }

  // useEffect(() => {
  //   loginCheck()
  // }, [])

  return (

    <View className='my'>
      <View className='my-header'>
        <View className='my-header-left'>
          <View className='my-image'>
            <Image src={userInfo.avatar}></Image>
          </View>
          <Text>{userInfo.username}</Text>
        </View>
        <View className='my-header-right'>
          <Icon name='replay' size='20px' onClick={showLong}></Icon>
        </View>
      </View>
      <View className='my-use'>
        <View className='my-use-top'>
          <Text>当前已使用</Text>
        </View>
        <View className='my-use-center'>
          <Text className='textOne'>{percentage.toFixed(2) + "%"}</Text>
          <Text className='textTwo'>{formatFileSize(userInfo.useSpace)||0} / {userInfo.space}G</Text>
        </View>
        <View className='my-use-bottom'>
          <Progress percentage={percentage.toFixed(2)} pivotText=' ' strokeWidth="50" color="#9fe7ff" />
        </View>
      </View>
      <View className='my-unbind' onClick={unBind}>
        <View>
          <Text>账号解绑</Text>
        </View>
        <View>
          <Image src={rightArr}></Image>
        </View>
      </View>
      <View className='my-recommend' onClick={recommend}>
        <View>
          <Text>意见反馈</Text>
        </View>
        <View>
          <Image src={rightArr}></Image>
        </View>
      </View>
      <Toast_ />
      <Dialog_ />
    </View>


  )
}
