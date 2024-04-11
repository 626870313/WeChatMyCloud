import { View, Text, Image, Checkbox, CheckboxGroup } from '@tarojs/components'
import Taro from '@tarojs/taro';
import moment from 'moment'
import {  Loading } from '@antmjs/vantui';
import { useEffect, useState } from 'react';
import FilesDetail from '../FilesDetail';
import { detailList, getImageFileNames } from '../../utils/types'

export default function FileList(props: any) {

  const {
    fileList,
    setFileList,
    setDetailFile,
    setShowDetail,
    loadingPop,
    page,
    showDetail,
    detailFile,
    setRefresh,
    setIsSelectAll,
    isSelectAll,
    valuesAll,
    setValuesAll,
    nobar=false
  } = props

  const fileNames = getImageFileNames();

  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    setSelectAll(isSelectAll)
  }, [isSelectAll])

  const getFileType = (name) => {
    if (name.lastIndexOf(".") > -1) {
      return name.slice(name.lastIndexOf(".") + 1).toLowerCase();
    } else {
      return "";
    }
  }

  const comeToFolder = (isFolder, file) => {
    let url = 'http://127.0.0.1:3000/download/stream/' + file.filename
    if (!isFolder) {
      const isImage = file.mimetype.includes('image')

      const token = Taro.getStorageSync('token');
      Taro.downloadFile({
        url: url,
        header: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        success: function (res) {

          let filePath = res.tempFilePath;
          if (isImage) {
            Taro.previewImage({
              current: filePath, // 当前显示图片的http链接
              urls: [filePath] // 需要预览的图片http链接列表
            })
          } else {
            Taro.openDocument({
              filePath: filePath,
              fileType: getFileType(file.originalname),
              success: function (res) {

              },
            });
          }


        },
      });
      return
    }

    Taro.navigateTo({
      url: `/pages/newfile/index?file=${JSON.stringify(file)}`
    })
  }

  const filesDetail = (detail, e) => {
    e.stopPropagation()
    setDetailFile(detail)
    setShowDetail(true)
  }


  const optionSelectAll = (filename) => {
    const cpfileslist = fileList.map(item => {
      return { ...item, checked: filename === item.filename ? true : false }
    })
    setSelectAll(true)
    setIsSelectAll(true)
    setValuesAll([filename])
    setFileList(cpfileslist)
  }

  const selectChange = (value)=>{
    const copyfilelist = fileList.map(item=>{
      let isChecked = value.includes(item.filename)
      return {...item,checked:isChecked}
    })

    setValuesAll(value)
    setFileList(copyfilelist)
  }


  const cancelSelectAll = () => {
    const copyFileList = fileList.map(item => {
      return { ...item, checked: false }
    })
    setValuesAll([])
    setFileList(copyFileList)
  }

  const handleSelectAll = () => {
    const allFiles = fileList.map(item => {
      return  item.filename 
    })
    const copyFileList = fileList.map(item => {
      return { ...item, checked: true }
    })
    setValuesAll(allFiles)
    setFileList(copyFileList)
  }

  const handleCanal = () => {
    setSelectAll(false)
    setIsSelectAll(false)
  }


  return (
    <>
      {

        selectAll ? <View className='flex justify-between items-center px-2 py-3'>
          <View className='text-gray-700'><Text onClick={handleCanal}>取消</Text></View>
          <View className='font-bold'>
            {
              valuesAll?.length === 0 ? <Text>选择文件</Text> : <Text>已选{valuesAll?.length}项</Text>
            }


          </View>
          <View className='text-sky-800'>
            {
              fileList?.length === valuesAll?.length ? <View onClick={cancelSelectAll}>取消全选</View> : <View onClick={handleSelectAll}>全选</View>
            }
          </View>
        </View> : null

      }



      <CheckboxGroup onChange={(e) => {
        selectChange(e.detail.value)
        }}>
        {
          fileList.length > 0 && fileList.map(item => {
            const isFolder = item.fieldname === 'folder';
            const folderIcon = fileNames.includes(item.fieldname) ? `../../static/filesTag/${item.fieldname}.jpg` : `../../static/filesTag/cloud.jpg`;
            const orginName = item.originalname.length > 25 ? item.originalname.substring(0, 25) + '...' : item.originalname
            return (
              !selectAll ?
                <View className='h-16 mx-3 my-1 flex justify-center p-1 overflow-hidden'>
                  <View className='flex justify-between items-center w-full' >

                    <View className='flex justify-center items-center' onClick={() => comeToFolder(isFolder, item)}>
                      <Image className='flex-none h-9 w-10 rounded' src={folderIcon}></Image>
                      <View className='flex flex-col justify-around items-baseline ml-5  line-clamp-2 text-ellipsis'>
                        <Text className='font-medium'>{!isFolder ? `${orginName}` || '未知标题' : `来自：${orginName || '未知来源'}`}</Text>
                        <Text className='text-gray-400 text-xs'>{!isFolder ? `${moment(item.createTime).format('YYYY/MM/DD HH:mm')} · ${item.size}` || '未知时间' : `${moment(item.createTime).format('YYYY/MM/DD HH:mm') || '未知时间'}`}</Text>
                      </View>
                    </View>

                    <View className='flex flex-col justify-center pl-4'>
                      <View className=' h-3.5 w-7 bg-gray-100 flex items-center justify-center rounded text-gray-400 text-xl' onClick={(e) => filesDetail(item, e)}>···</View>
                    </View>
                  </View>
                </View> :

                <View className='h-16 mx-3 my-1 flex justify-center p-1 overflow-hidden'>
                  <View className='flex justify-between items-center w-full' >


                    <View className='flex justify-center items-center' onClick={() => comeToFolder(isFolder, item)}>
                      <Image className='flex-none h-9 w-10 rounded' src={folderIcon}></Image>
                      <View className='flex flex-col justify-around items-baseline ml-5  line-clamp-2 text-ellipsis'>
                        <Text className='font-medium'>{!isFolder ? `${orginName}` || '未知标题' : `来自：${orginName || '未知来源'}`}</Text>
                        <Text className='text-gray-400 text-xs'>{!isFolder ? `${moment(item.createTime).format('YYYY/MM/DD HH:mm')} · ${item.size}` || '未知时间' : `${moment(item.createTime).format('YYYY/MM/DD HH:mm') || '未知时间'}`}</Text>
                      </View>
                    </View>

                    <View className='flex flex-col justify-center pl-4'>
                      <Checkbox style={{ justifyContent: 'flex-end' }} value={item.filename} checked={item.checked} />
                    </View>

                  </View>

                </View>
            )
          })
        }
      </CheckboxGroup>
      {
        fileList && fileList.length === 0 ?
          <View className='flex justify-center items-center p-2 mt-32'>
            <Text className='text-slate-300'>无数据</Text>
          </View>
          :
          <View className='text-center p-2'>
            {
              loadingPop ? <Loading type="spinner" size='1.2rem' /> : page !== 1 ? <Text className='text-slate-300'>已到底了</Text> : null
            }
          </View>

      }

      <FilesDetail
        show={showDetail}
        setShow={setShowDetail}
        detailList={detailList}
        detailFile={detailFile}
        setRefresh={setRefresh}
        optionSelectAll={optionSelectAll}
        nobar={nobar}
      />


    </>

  )
}