import { View, Text, Image, Button } from '@tarojs/components'
import { useDidShow, useLoad, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import folder from '../../static/iconfont/folder.png'
import UploadModal from '../../components/UploadModal'
import { useEffect, useState } from 'react'
import { deleteFile, getFileList } from '../../api/file'
import FileList from '../../components/FileList'
import ProgressPop from '../../components/ProgressPop'
import { uploadType, selectAllOption } from '../../utils/types'
import { Icon } from '@antmjs/vantui'
import Taro from '@tarojs/taro'

export default function Index() {
  const [show, setShow] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [fileList, setFileList] = useState<any>([])
  const [refresh, setRefresh] = useState<boolean>(false)
  const [detailFile, setDetailFile] = useState<any>()
  const [upProgress, setUpProgress] = useState(0)
  const [upCount, setUpCount] = useState(0)
  const [upCom, setUpCom] = useState(false)
  const [page, setPage] = useState(1)

  const [loadingPop, setLoadingPop] = useState(false)
  const [reachBtm, setReachBtm] = useState(false)

  const [isSelectAll, setIsSelectAll] = useState(false)
  const [valuesAll, setValuesAll] = useState([''])


  const getRequest = async (page = 1) => {
    const token = Taro.getStorageSync('token');
    if (!token) setFileList([])
    if (reachBtm) return
    let res = await getFileList({ page, pageSize: 10, all: true })
    if (res.code === 200) {
      let { data } = res
      if (page === 1) return setFileList(data.sort(customSort))
      if (data.length === 0) return setReachBtm(true)
      const list = fileList.concat(data).sort(customSort)
      setFileList(list)
      setPage(page)
    }
  }

  usePullDownRefresh(() => {
    setReachBtm(false)
    setPage(1)
    getRequest(1)
  })

  useReachBottom(() => {
    setLoadingPop(true)
    getRequest(page + 1)
    setLoadingPop(false)
  })

  useLoad(() => {
    console.log('Page loaded.')
  })

  useEffect(() => {
    setReachBtm(false)
    setPage(1)
    getRequest(1)
    if (refresh) {
      setRefresh(false)
    }
  }, [refresh])

  useDidShow(() => {
    setReachBtm(false)
    setPage(1)
    getRequest(1)
  })

  const fileUpload = () => {
    setShow(true)
  }

  //排序
  const customSort = (a, b) => {
    if (a.fieldname === "folder") {
      if (b.fieldname === "folder") {
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
      } else {
        return -1;
      }
    }
    if (b.fieldname === "folder") {
      return 1;
    }
    return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
  }



  const handleOptions = (item) => {
    if (item.title === '删除') {
      //批量删除
      Taro.showModal({
        title: '删除文件(或文件夹)',
        content: '删除后将放入回收站，如需恢复请打开云盘APP-头像-回收站',
        success: async (res) => {
          if (res.confirm) {
            let res = await deleteFile(valuesAll)
            if (res.code === 200) {
              setShow(false)
              setRefresh(true)
            }
            setIsSelectAll(false)
            setValuesAll([])
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else if (item.title = '分享') {
      handleShare(valuesAll)
    }
  }


  const handleShare = (file) => {
    let url = 'http://127.0.0.1:3000/download/stream/' + file[0]
    const token = Taro.getStorageSync('token');
    // Taro.downloadFile({
    //   url,
    //   header: {
    //     'Content-Type': 'multipart/form-data',
    //     'Authorization': token ? `Bearer ${token}` : '',
    //   },
    //   success: (res) => {
    //     Taro.showShareImageMenu({
    //       path: res.tempFilePath,
    //       fail:(res)=>{
    //         console.log('失败',res)
    //       }
    //     })
    //   }
    // })


    Taro.downloadFile({
      url: url,
      header: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      success: function (res) {
        console.log(res)
        Taro.shareFileMessage({
          filePath:res.tempFilePath,
          fileName:'123.xlsx',
          fail(res){
            console.log(res)
            Taro.showToast({
              title:'分享失败'
            })
          }
        })

      },
    });
  }


  return (
    <>

      <View className='z-50 by-white sticky top-0 mx-3'>
        {
          !isSelectAll ?
            <View className='bg-cyan-100 rounded p-3'>
              <View className='flex justify-around w-11/12'>
                <View className='flex mr-4'>
                  <Image className='flex-none w-10 h-10 m-3' src={folder}></Image>
                  <View className='flex flex-col justify-around '>
                    <Text className='text-black font-bold text-sm'>这里是共享文件和转存资源的空间</Text>
                    <Text className='text-gray-400 font-light text-xs'>转存的资料我们为你智能整理了分类，你可以轻松找到</Text>
                  </View>
                </View>

                <View className='flex flex-col justify-center'>
                  <Text className='text-sky-200'>X</Text>
                </View>
              </View>
            </View> : null

        }
      </View>
      <View className='flex flex-col items-center relative'>
        {/* 滚动列表 */}
        <View className='w-full'>
          <FileList
            page={page}
            fileList={fileList}
            setFileList={setFileList}
            showDetail={showDetail}
            detailFile={detailFile}
            setRefresh={setRefresh}
            setDetailFile={setDetailFile}
            setShowDetail={setShowDetail}
            loadingPop={loadingPop}
            setIsSelectAll={(isAll) => setIsSelectAll(isAll)}
            isSelectAll={isSelectAll}
            valuesAll={valuesAll}
            setValuesAll={setValuesAll}
          />

        </View>

        {
          !isSelectAll ?
            <View className='fixed flex justify-center items-center w-full p-2' style={{ position: showProgress ? 'sticky' : 'fixed', bottom: showProgress ? '4rem' : '1.5rem' }}>
              <Button className='w-full bg-gradient-to-r from-cyan-900 via-cyan-700 to-cyan-700 rounded-3xl border-none text-white' onClick={fileUpload}>上传文件</Button>
            </View> : valuesAll.length > 0 ?

              <View className='fixed flex justify-center items-center w-full p-2' style={{ position: showProgress ? 'sticky' : 'fixed', bottom: showProgress ? '4rem' : '1.5rem' }}>
                <View className='flex justify-center items-center w-full rounded-3xl bg-gray-100'>
                  {
                    selectAllOption.map(item => (
                      <View className='flex flex-col justify-between items-center p-2 w-full' onClick={() => handleOptions(item)}>
                        <Icon name={item.icon} size='1.35rem' />
                        <Text>{item.title}</Text>
                      </View>
                    ))
                  }
                </View>

              </View> : null
        }

        {/* 进度 */}
        <ProgressPop
          showProgress={showProgress}
          upProgress={upProgress}
          upCount={upCount}
          upCom={upCom}
          setShowProgress={setShowProgress}
        />

        {/* 上传文件对话框 */}
        <UploadModal
          uploadType={uploadType}
          show={show}
          setShow={setShow}
          onOk={() => {
            setRefresh(true);
          }}
          path=''
          all={true}
          onprogress={setUpProgress}
          oncount={setUpCount}
          onCom={setUpCom}
          setShowProgress={setShowProgress}
        />

      </View>
    </>

  )
}
