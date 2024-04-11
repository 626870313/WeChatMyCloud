import { View, Text, Input } from "@tarojs/components";
import { Checkbox, Button, Dialog, Form, FormItem, Icon } from '@antmjs/vantui';
import { useMemo, useState } from "react";
import Taro,{ useLoad } from '@tarojs/taro'
import {Login,getUserInfo} from '../../api/login'

const Dialog_ = Dialog.createOnlyDialog();

export default function phone() {
  const [value, setValue] = useState(false);
  const [see,setSee] = useState(false)

  const formIt = Form.useForm()

  const goIndexPage = ()=>{
    Taro.switchTab({
      url:'/pages/index/index',
      complete:()=>{
        Taro.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000
        })
      }
    })

  }

  const handleClick =  () => {
    if(!value) {
      Taro.showToast({
        title: '请勾选底部协议！',
        icon:'error',
        duration: 800
      })
      return 
    }
    
    formIt.validateFields(async (errorMessage, fieldValues) => {

      if (errorMessage && errorMessage.length) {
        Dialog.alert({
          message: `errorMessage: ${JSON.stringify(errorMessage)}`,
          selector: '#form-demo11',
        })
        return 
      }


      Login(fieldValues).then(res=>{
          Taro.setStorage({
            key:"token",
            data:res.access_token
          })
          if(res.code==='200'){
            getUserInfo({}).then(res=>{
              Taro.setStorage({
                key:"userInfo",
                data:res
              })
            })
            goIndexPage()
          }else{
            Taro.showToast({
              title: res.message,
              icon:'error',
              duration: 800
            })
          }
      })
    })
  }

  const seePassword = (type: string)=>{
    if(type==='close'){
      setSee(true)
    } else if(type==='open'){
      setSee(false)
    }
  }

  const userNameRule = useMemo(() => {
    return {
      rule: /^[a-zA-Z0-9]{4,12}$/,
      message: '账号为长度4-12的字母数字',
    };
  }, [formIt.getFieldValue('userName')]);

  useLoad((option) => {
    const {checkedGree} = option
    if(checkedGree==='true'){
      setValue(true)
    }else{
      setValue(false)
    }
  })
  
  const onchange = (e)=>{
    setValue(e.detail)
  }

  const handleRegister = ()=> {
    Taro.navigateTo({
      url:'/pages/register/index'
    })
  }

  return (
    <View className="h-screen w-screen py-20 px-5 bg-gradient-to-r from-slate-200 from-20% via-slate-300 via-45% to-slate-300 to-80%">
      <View className="p-8 bg-white flex flex-col justify-center items-center" style={{ borderRadius:'2.5rem 0' }}>
        <View className="mx-4 mt-6 mb-4 text-2xl font-bold">
          <Text>欢迎登录</Text>
        </View>
        <View>
          <Form
            initialValues={{
              username: '18024587155',
              password:'123456'
            }}
            form={formIt}
            onFinish={(errs, res) => console.info(errs, res)}
          >
            <FormItem
              borderBottom
              label="用户名"
              name="username"
              required
              rules={userNameRule}
              trigger="onInput"
              validateTrigger="onBlur"
              // taro的input的onInput事件返回对应表单的最终值为e.detail.value
              valueFormat={(e) => e.detail.value}
              renderRight={<Icon size="1.2rem" name="user-o" />}
            >
              <Input placeholder="请输入用户名（中文）" />
            </FormItem>
            <FormItem
              borderBottom
              label="密码"
              name="password"
              required
              // rules={passwordRule}
              trigger="onInput"
              validateTrigger="onBlur"
              // taro的input的onInput事件返回对应表单的最终值为e.detail.value
              valueFormat={(e) => e.detail.value}
              renderRight={!see?<Icon className="cursor-pointer" size="1.2rem" name="closed-eye" onClick={(e)=>seePassword('close')}/>:<Icon className="cursor-pointer" size="1.2rem" name="eye" onClick={(e)=>seePassword('open')}/>}
            >
              <Input placeholder="请输入密码" password={!see}/>
            </FormItem>


            <Button
              className="van-button-submit w-full"
              style={{ backgroundColor: 'black', color: 'white', margin: '2rem 0px' }}
              onClick={handleClick}
            // formType="submit"
            >
              立即登录
            </Button>

          </Form>

        </View>
        <View className="flex cursor-pointer">
          <Checkbox className="cursor-pointer" iconSize="0.8rem" value={value} onChange={(e) => onchange(e)}>
          <Text className='text-xs cursor-pointer'>已阅读并同意《用户协议》和《隐私协议》</Text>
          </Checkbox>
        </View>
        <View className="mt-2 text-center">没有账号？<Text className="underline" onClick={handleRegister}>注册一个</Text></View>
      </View>
      <Dialog_ />
    </View>
  );
}
