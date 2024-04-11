import { View, Image, Text } from "@tarojs/components";
import { useState } from "react";
import UpdateNameDialog from "../UpdateNameDialog";
import { upFolder } from "../../api/file";
import { Toast } from "@antmjs/vantui";
import Taro from "@tarojs/taro";

export default function CreateIVF(props: any) {

  const { uploadType, showAction, afterRead, needModel,path,all } = props

  const [showPop, setShowPop] = useState(false)
  const [createFolderName, setCreateFolderName] = useState('新建文件夹')


  const createFolder = async () => {
    let res = await upFolder({ directoryPath: path, folderName: createFolderName, all })
    if (res.code !== 200) {
      return Toast.fail({
        message: res.message,
        duration: 1500
      })
    }
    setShowPop(false)
    Taro.navigateTo({
      url: `/pages/newfile/index?file=${JSON.stringify(res.data)}`
    })
  }

  const openCreateFolder = () => {
    showAction()
    if (needModel) {
      setShowPop(true)
    }
  }


  const hidePopShow = () => {
    setShowPop(false)
  }

  return (
    <>
      <View className='flex items-center w-full justify-between'>
        {uploadType.map((item, index) => (
            <View className='w-24 h-20 flex flex-col justify-center items-center bg-slate-100 rounded-xl' onClick={item.upfile ? afterRead:openCreateFolder}>
              <Image className="w-5 h-5 my-2" src={item.icon}></Image>
              <Text className="text-sm font-light">{item.title}</Text>
            </View>
        ))}
      </View>
      {/* 新建文件夹对话框 */}
      {
        needModel ?
        <UpdateNameDialog
          show={showPop}
          hidePopShow={hidePopShow}
          createFolder={createFolder}
          createFolderName={createFolderName}
          setCreateFolderName={setCreateFolderName}
        />
        : null
      }

    </>

  )
}