import { Overlay, Toast,Field  } from "@antmjs/vantui";
import { View,Text,Image } from "@tarojs/components";
import folder from '../../static/filesTag/folder.jpg'

export default function UpdateNameDialog(props:any){

  const {show,hidePopShow,createFolder,createFolderName,setCreateFolderName} = props

  return (
    <Overlay show={show} onClick={hidePopShow}>
    <View className="flex items-end justify-center h-full">
      <View className="w-10/12 bg-white mb-5 p-3 relative rounded-lg" onClick={(e) => {
        e.stopPropagation();
      }} >
        <Toast />
        <View>
          <View className='flex justify-around items-center border-b-2 p-3 border-gray-200'>
            <Text className='cursor-pointer' onClick={hidePopShow}>取消</Text>
            <Text className='cursor-pointer font-bold'>新建文件夹</Text>
            <Text className='cursor-pointer' onClick={createFolder}>确认</Text>
          </View>
          <View className='text-center'>
            <Image className='w-20 h-20 my-3' src={folder} />
            <Field className='bg-gray-100 p-3 rounded-md mb-5' type="text" inputAlign="center" border={false} placeholder='文件名称' value={createFolderName} onChange={(e) => setCreateFolderName(e.detail)} />
          </View>
        </View>
      </View>
    </View>
  </Overlay>
  )
}