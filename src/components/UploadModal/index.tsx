import { View, Text, Image } from '@tarojs/components'
import weichat from '../../static/iconfont/weichat.png'
import { Icon, Overlay, Toast } from '@antmjs/vantui'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import CreateIVF from '../CreateIVF'
import { upFolder } from '../../api/file'
import UpdateNameDialog from '../UpdateNameDialog'

export default function UploadModal(props: any) {

  const { uploadType, show, setShow, onOk, path, all, onprogress, oncount, onCom, setShowProgress } = props

  const showAction = () => {
    setShow(false)
    setShowPop(true)
  }

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
    onOk()
    Taro.navigateTo({
      url: `/pages/newfile/index?file=${JSON.stringify(res.data)}`
    })
  }

  const [value, setValue] = useState([])

  const afterRead = (event) => {

    hideShow()
    Taro.chooseMessageFile({
      count: 10,
      type: 'image',
      success: function (res) {
        const tempFiles = res.tempFiles
        let successUp = 0
        let failUp = 0
        let length = tempFiles.length
        let count = 0
        uploadOnByOne(tempFiles,successUp,failUp,count,length)
      },
      complete:(res)=>{
        if(res.errMsg!=="chooseMessageFile:fail cancel"){
          onCom(false)
          setShowProgress(true)
        }
      }
    })

  }


  const uploadOnByOne = (paths,successUp,failUp,count,length)=>{
    const token = Taro.getStorageSync('token');
    const uploadTask = Taro.uploadFile({
      url: 'http://127.0.0.1:3000/upload/files',
      filePath: paths[count].path,
      name: 'file',
      formData: {
        name: paths[count].name,
        uploadPath: path
      },
      header: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      timeout: 10000,
      success(res) {
        let {data} = res
        successUp++
      },
      fail:(res)=>{
        failUp++
      },
      complete:(res)=>{
        count++
        if(count==length){
          oncount(count)
          onCom(true)
          onOk()
        }else{
          oncount(successUp)
          uploadOnByOne(paths,successUp,failUp,count,length)
        }
      }
    })
    uploadTask.onProgressUpdate((res) => {
      onprogress(res.progress)
    })
  }

  const deleteAction = (event) => {
    const { index } = event.detail
    const valueNew = JSON.parse(JSON.stringify(value))
    valueNew.splice(index, 1)
    setValue(valueNew)
  }

  const hideShow = () => {
    setShow(false)
  }

  const hidePopShow = () => {
    setShowPop(false)
  }


  return (
    <>
      <Overlay show={show} onClick={hideShow}>
        <View className="flex justify-center items-end h-full ">
          <View className="w-11/12 bg-white mb-5 p-5 relative rounded-lg" onClick={(e) => {
            e.stopPropagation();
          }} >
            <View className='flex flex-col justify-around items-center'>

              <Text className='text-xl'>上传文件</Text>

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
                needModel={false}
                path={path}
                all={all}
              />


            </View>
            <View className='absolute top-2 right-2'>
            <Icon onClick={hideShow} name='cross'></Icon>

            </View>

          </View>
        </View>
      </Overlay>

      {/* 新建文件夹对话框 */}
      <UpdateNameDialog
      show={showPop}
      hidePopShow={hidePopShow}
      createFolder={createFolder}
      createFolderName={createFolderName}
      setCreateFolderName={setCreateFolderName}
      />


    </>
  )

}

