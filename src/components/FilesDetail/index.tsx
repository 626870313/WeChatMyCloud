import { View, Text, Image } from '@tarojs/components'
import weichat from '../../static/iconfont/weichat.png'
import { Divider, Icon, Overlay, Dialog } from '@antmjs/vantui'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import ReFileName from '../../components/ReFileName'
import { deleteFile } from '../../api/file/index'
import moment from 'moment'
const Dialog_ = Dialog.createOnlyDialog()

export default function FilesDetail(props: any) {

  const { show, setShow, detailList, detailFile, setRefresh,nobar=false,optionSelectAll } = props
  const [showUpn, setShowUpn] = useState(false)

  useEffect(() => {
    if(nobar) return
    if (show || showUpn) {
      Taro.hideTabBar({ animation: true });
    }else{
      Taro.showTabBar({ animation: true });
    }
  }, [show,showUpn])

  const confirm = (title, message) => {
    Dialog_.confirm({
      title,
      message,
    }).then(async (value) => {
      if (value === 'confirm') {
        await deleteFile({ filename: detailFile.filename })
        setShow(false)
        setRefresh(true)
      }

    })
  }

  const detailUp = (i) => {
    setShow(false)
    if (i === 0) {
      //重命名
      setShowUpn(true)
    }else if(i===1){
      //选择文件
      optionSelectAll(detailFile.filename)
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


  return (
    <>
      <Overlay show={show} onClick={() => setShow(false)}>
        <View className="flex justify-center items-end h-full ">
          <View className="w-11/12 bg-white mb-5 p-5 relative rounded-lg" onClick={(e) => {
            e.stopPropagation();
          }} >
            <Dialog_ />
            <View className='text-sm font-medium'>
              <View className='flex justify-around w-full'>
                <View className='flex w-full'>
                  <View>
                    <Image className='w-9 h-9 mr-5' src={weichat}></Image>
                  </View>
                  <View className='flex flex-col justify-around truncate'>
                    <Text className='truncate text-black'>{detailFile?.originalname}</Text>
                    <Text className='text-gray-500 font-thin text-xs truncate'>{moment(detailFile?.createTime).format('YYYY-MM-DD HH:mm:ss')} {detailFile?.createTime && formatFileSize(detailFile?.size) && '·'} {formatFileSize(detailFile?.size)}</Text>
                  </View>
                </View>
              </View>
              <Divider />
              <View>
                {
                  detailList.map((item, index) => {
                    return (
                      <View className='flex justify-between items-center p-3 bg-gray-200 border-b-2 border-gray-100 last:border-none first:rounded-t-xl last:rounded-b-xl' onClick={() => detailUp(index)}>
                        <Text>{item.title}</Text>
                        <Icon name={item.icon} size='1.35rem' />
                      </View>
                    )
                  })
                }

              </View>

              <View>

                <View className='flex justify-between items-center bg-red-200 rounded-xl mt-6 p-3' onClick={() => confirm('删除文件夹', '删除后将放入回收站，如需恢复请打开云盘APP-头像-回收站')}>
                  <Text>移至回收站</Text>
                  <Icon name='delete-o' size='1.35rem' />
                </View>
              </View>
            </View>
          </View>
        </View>

      </Overlay>

      <ReFileName
        detailFile={detailFile}
        show={showUpn}
        setShow={setShowUpn}
        setRefresh={setRefresh}
      />
    </>
  )

}

