
import { useLoad, useReachBottom } from '@tarojs/taro'
import UploadModal from '../../components/UploadModal'
import { useEffect, useState } from 'react'
import { deleteFile, getFileList } from '../../api/file'
import FileList from '../../components/FileList'
import ProgressPop from '../../components/ProgressPop'
import Nofilesfolder from '../../components/Nofilesfolder/index'
import { uploadType, selectAllOption, detailList } from '../../utils/types'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { Icon } from '@antmjs/vantui'


export default function newfile() {
  const [show, setShow] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [fileList, setFileList] = useState<any>([])
  const [path, setPath] = useState<any>('')
  const [belongName, setBelongName] = useState<any>('')
  const [refresh, setRefresh] = useState<boolean>(false)
  const [detailFile, setDetailFile] = useState<any>()
  const [showProgress, setShowProgress] = useState(false)

  const [upProgress, setUpProgress] = useState(0)
  const [upCount, setUpCount] = useState(0)
  const [upCom, setUpCom] = useState(false)
  const [loadingPop, setLoadingPop] = useState(false)
  const [page, setPage] = useState(1)

  const [isSelectAll, setIsSelectAll] = useState(false)
  const [valuesAll, setValuesAll] = useState([''])

  useEffect(() => {
    if (belongName) {
      getRequest(page, belongName)
      if (refresh) setRefresh(false)
    }
  }, [refresh])

  const fileUpload = () => {
    setShow(true)
  }

  const getRequest = (page, name) => {
    getFileList({ page, pageSize: 10, all: false, beName: name }).then(res => {
      if (res.code === 200 && res.data.length !== 0) {
        let { data } = res
        if (page === 1) return setFileList(data.sort(customSort))
        const list = fileList.concat(data)
        setFileList(list.sort(customSort))
        setPage(page)
      } else {
        setFileList([])
      }
    })
  }

  useLoad((option) => {
    const { file } = option
    setPath(JSON.parse(file).path)
    setBelongName(JSON.parse(file).filename)
    getRequest(page, JSON.parse(file).filename)
  })

  useReachBottom(() => {
    setLoadingPop(true)
    getRequest(page + 1, belongName)
    setLoadingPop(false)
  })


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
    }
  }

  return (
    <>
      {
        fileList && fileList.length > 0 ?
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
                nobar={true}
                setDetailFile={setDetailFile}
                setShowDetail={setShowDetail}
                loadingPop={loadingPop}
                setIsSelectAll={(isAll) => setIsSelectAll(isAll)}
                isSelectAll={isSelectAll}
                valuesAll={valuesAll}
                setValuesAll={setValuesAll}
              />
            </View>

          </View> : <Nofilesfolder path={path} all={false} />

      }


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
          setRefresh(true)
        }}
        path={path}
        all={false}
        onprogress={setUpProgress}
        oncount={setUpCount}
        onCom={setUpCom}
        setShowProgress={setShowProgress}
      />
    </>

  )
}
