import { View, Text } from "@tarojs/components";
import { Checkbox, Field, Button, Dialog } from '@antmjs/vantui';
import { useState } from "react";


export default function code(props: any) {

  const { phone } = props

  const [code, setCode] = useState('')

  return (
    <View className="text-center m-8">
      <View className="text-2xl">
        <Text>输入验证码</Text>
      </View>
      <View className="m-5">
      <Text className="text-gray-500">验证码已发送到 <Text className="font-bold text-black">18024587155</Text> ，请稍后</Text>
      </View>
      <Field value={code} className="m-8"/>
      <Text className="text-gray-500"><Text className="font-bold text-black">58秒</Text>后重新获取验证码</Text>
    </View>
  )
}