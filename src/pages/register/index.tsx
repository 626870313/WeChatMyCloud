import { View, Text, Input } from "@tarojs/components";
import { Button, Dialog, Form, FormItem } from '@antmjs/vantui';
import { useMemo } from "react";
import Taro from '@tarojs/taro'
import { Signup } from '../../api/register'


const Dialog_ = Dialog.createOnlyDialog();

export default function register() {

  const formIt = Form.useForm()

  const goIndexPage = () => {
    Taro.navigateBack({
      complete: () => {
        Taro.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 1000
        })
      }
    })

  }

  const handleClick = () => {
    if (formIt.getFieldValue('password2') !== formIt.getFieldValue('password')) {
      Taro.showToast({
        title: '请重新确认密码',
        icon: 'error',
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


      Signup(fieldValues).then(res => {
        if (res.code === 200) {
          goIndexPage()
        } else {
          Taro.showToast({
            title: res.message,
            icon: 'error',
            duration: 800
          })
        }
      })
    })
  }

  const userNameRule = useMemo(() => {
    return {
      rule: /^1[3456789]\d{9}$/,
      message: '手机号码格式错误',
    };
  }, [formIt.getFieldValue('userName')]);

  const passwordRule = useMemo(() => {
    return {
      rule: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,20}$/,
      message: '请输入正确的密码',
      // 密码长度在6到20个字符之间，至少包含一个数字、一个小写字母、一个大写字母和一个特殊字符。
    };
  }, [formIt.getFieldValue('password')]);


  const handleForget = () => {
    return
  }
  return (
    <View className="h-screen w-screen py-20 px-5 bg-gradient-to-r from-slate-200 from-20% via-slate-300 via-45% to-slate-300 to-80%">
      <View className="p-8 bg-white flex flex-col justify-center items-center" style={{ borderRadius: '0 2.5rem' }}>
        <View className="mx-4 mt-6 mb-4 text-2xl font-bold">
          <Text>注册</Text>
        </View>
        <View>
          <Form
            initialValues={{
              username: '15817151368',
              password: 'Xie123456+',
              password2: 'Xie123456+'
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
              valueFormat={(e) => e.detail.value}
            >
              <Input placeholder="请输入用户名（中文）" />
            </FormItem>
            <FormItem
              borderBottom
              label="密码"
              name="password"
              required
              rules={passwordRule}
              trigger="onInput"
              validateTrigger="onBlur"
              valueFormat={(e) => e.detail.value}
            >
              <Input placeholder="请输入密码" password={true} />
            </FormItem>
            <FormItem
              borderBottom
              label="确认密码"
              name="password2"
              required
              rules={passwordRule}
              trigger="onInput"
              validateTrigger="onBlur"
              valueFormat={(e) => e.detail.value}
            >
              <Input placeholder="请再次输入密码" password={true} />
            </FormItem>

            <Button
              className="van-button-submit w-full"
              style={{ backgroundColor: 'black', color: 'white', margin: '2rem 0px' }}
              onClick={handleClick}
            // formType="submit"
            >
              注册
            </Button>

          </Form>

        </View>
        <View className="flex cursor-pointer">
          <Text className="underline" onClick={handleForget}>忘记密码</Text>
        </View>
      </View>
      <Dialog_ />
    </View>
  );
}