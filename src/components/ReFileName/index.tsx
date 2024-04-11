import { Overlay, Image, Field } from "@antmjs/vantui";
import { View, Text } from '@tarojs/components'
import folder from '../../static/filesTag/folder.jpg'
import { upFileName } from '../../api/file/index'
import { useEffect, useState } from "react";

export default function ReFileName(props: any) {

  const { show, setShow, detailFile, setRefresh } = props
  const [createFileName, setCreateFileName] = useState('')
  const [extension, setExtension] = useState('')

  useEffect(() => {
    let name: string
    let lastDotIndex: string
    let extension: string

    lastDotIndex = detailFile?.originalname.lastIndexOf(".");
    name = detailFile?.originalname.substring(0, lastDotIndex); // 文件名部分
    extension = detailFile?.originalname.substring(lastDotIndex + 1); // 后缀名部分

    if (detailFile?.fieldname === 'folder') {
      name = detailFile?.originalname
      extension = ''
    }

    setCreateFileName(name)
    setExtension(extension)
  }, [detailFile?.originalname])

  const hidePopShow = () => {
    setShow(false)
  }

  const updateName = async () => {
    const { username, filename } = detailFile
    const res = await upFileName({ username, filename, originalname:detailFile?.fieldname !== 'folder'? createFileName + '.' + extension:createFileName,belong:detailFile?.belong })
    if (res.code === 200) {
      setRefresh(true)
      hidePopShow()
    }
  }

  return (
    <>
      <Overlay show={show} onClick={hidePopShow}>
        <View className="flex items-end justify-center h-full w-full">
          <View className="bg-white relative w-full h-2/5" onClick={(e) => {
            e.stopPropagation();
          }} >
            <View>
              <View className='border-b-2 border-gray-200 flex justify-around items-center p-3'>
                <Text className="cursor-pointer" onClick={hidePopShow}>取消</Text>
                <Text className="font-bold">重命名</Text>
                <Text className="cursor-pointer" onClick={updateName}>确认</Text>
              </View>

              <View className="p-4 flex flex-col items-center justify-center">
                <Image src={folder} className="h-16 w-16 mb-3" />
                <Field inputAlign='center' className="w-full rounded-md" placeholder="请输入名称" value={createFileName} onChange={(e) => setCreateFileName(e.detail)} />
              </View>

            </View>
          </View>
        </View>
      </Overlay>
    </>
  )
}