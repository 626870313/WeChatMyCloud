import { View, Text, Image, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import weichat from '../../static/iconfont/weichat.png'
import pick from '../../static/iconfont/pick.png'
import folder1 from '../../static/iconfont/folder1.png'
import vid from '../../static/iconfont/vid.png'
import { useState } from 'react'
import CreateIVF from '../../components/CreateIVF'




export default function nofilesfolder(props) {

  const {path,all} = props

  const [show, setShow] = useState(false)
  const [value, setValue] = useState([])

  const uploadType: any = [
    {
      icon: pick,
      title: '上传文件',
      accept: 'image',
      upfile: true
    },
    {
      icon: vid,
      title: '上传视频',
      accept: 'video',
      upfile: true
    },
    {
      icon: folder1,
      title: '新建文件夹',
      accept: 'video',
      upfile: false
    }
  ]

  useLoad(() => {
    console.log('Page loaded.')
  })

  const fileUpload = () => {
    setShow(true)
  }

  const showAction = () => {
    setShow(false)
  }

  const afterRead = (event) => {
    const { file } = event.detail
    setValue(value.concat(file))
  }

  const deleteAction = (event) => {
    const { index } = event.detail
    const valueNew = JSON.parse(JSON.stringify(value))
    valueNew.splice(index, 1)
    setValue(valueNew)
  }

  return (
    <View className='relative'>

      <View className='p-4'>
        <View className='text-lg'>
          <Text>文件夹没有内容，试试上传文件吧</Text>
        </View>

        <View className='w-full bg-gray-100 my-4 py-4 rounded-lg flex justify-between items-center'>
          <View className='flex justify-around items-center w-full'>
            <View className='flex'>
              <Image className='w-10 h-10 mr-3' src={weichat}></Image>
              <View className='flex flex-col justify-around align-middle'>
                <Text className='text-base font-bold'>备份聊天文件</Text>
                <Text className='text-gray-400'>文件上传至[新建文件夹]</Text>
              </View>
            </View>
            <View className='bg-sky-600 py-2 px-3 rounded-full text-white'>去上传</View>
          </View>
        </View>


        <CreateIVF
          show={show}
          showAction={showAction}
          afterRead={afterRead}
          deleteAction={deleteAction}
          uploadType={uploadType}
          needModel={true}
          path={path}
          all={false}
        />
      </View>


    </View>
  )
}
