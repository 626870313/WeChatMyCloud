import { Icon, Checkbox } from '@antmjs/vantui'
import { Button, Text, View } from '@tarojs/components'
import { useState } from 'react'
import './index.less'
import Taro from '@tarojs/taro'

export default function login() {

  const [value, setValue] = useState(false)

  const phoneLogin = () => {
    Taro.navigateTo({
      url: `/pages/phone/index?checkedGree=${value}`
    })
  }

  const quickLogin = async () => {
    // const {code} = await Taro.login();
    // const url = 'http://localhost:3000/login';
    // const {data} = await request({method:"POST", url, data:{code} });
    // 登录成功之后 将token存入全局 并重定向到首页
    // wx.setStorageSync('token', data.token);
    // wx.redirectTo({url: '/pages/index/index'})

    // Taro.login({
    //   success: function (res) {
    //     console.log('res', res)
    //     if (res.code) {
    //       //发起网络请求
    //       Taro.request({
    //         method: "POST",
    //         url: 'http://localhost:3000/login/logincode',
    //         data: {
    //           code: res.code
    //         }
    //       }).then(res => {
    //         console.log('res2', res)
    //         Taro.setStorageSync('token', "Bearer " + res.data.token);
    //         // Taro.redirectTo({url: '/pages/index/index'})
    //       })

    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })
    Taro.showToast({
      title: '暂未开放快捷登录，请使用账号密码登录！',
      icon: 'error',
      duration: 1500
    })
  }



  return (
    <>
      <View className='login'>
        <View className='my-login'>
          <View className='my-login-top'>
            <Icon style={{ color: 'rgb(108, 183, 250)' }} size='6rem' name='gem' className='login-top-icon'></Icon>
            <Text>树云</Text>
          </View>
          <View className='my-login-center'>
            <View className='login-center'>
              <Checkbox className='login-center-check' value={value} onChange={(e) => setValue(e.detail)} />
              <View className='login-center-gree'>
                我已阅读并同意
                <Text className='center-gree-s'>《用户协议》</Text>
                和
                <Text className='center-gree-s'>《隐私协议》</Text>
                ，未注册用户一键登录即自动注册
              </View>
            </View>



          <Button onClick={phoneLogin} className='center-btn'>账号密码登录</Button>
            
            <Button
              className='center-btn'
              style={{ backgroundColor: 'rgb(108, 183, 250)' }}
              onClick={quickLogin}
            >手机号快捷登录</Button>

          </View>
        </View>

      </View>
    </>
  )
}