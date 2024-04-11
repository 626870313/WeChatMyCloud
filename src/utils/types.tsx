//获取所有文件图标的名字
export const getImageFileNames = () => {
  const importAll = (context) => context.keys().map(context);
  const images = importAll(require.context('../static/filesTag', false, /\.(png|jpe?g|svg)$/));
  
  // return images.map(imagePath => {
  //   return imagePath.split('/').pop();
  // });
  return images.map(imagePath => {
    const fileNameWithExtension = imagePath.split('/').pop();
    const fileName = fileNameWithExtension.split('.')[0]; 
    return fileName;
  });
};

//文件详情操作列表
export const detailList: any = [
  // {
  //   title: '快传',
  //   icon: 'logistics'
  // },
  // {
  //   title: '移至资源库',
  //   icon: 'peer-pay'
  // },
  {
    title: '重命名',
    icon: 'edit'
  },
  {
    title: '选择文件',
    icon: 'qr'
  }
]


//文件对话框列表及图片
import pick from '../static/iconfont/pick.png'
import folder1 from '../static/iconfont/folder1.png'
import vid from '../static/iconfont/vid.png'
export const uploadType: any = [
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


export const selectAllOption:any = [
  // {
  //   title: '其他',
  //   icon: 'qr'
  // },
  {
    title: '分享',
    icon: 'share-o'
  },
  {
    title: '删除',
    icon: 'delete-o'
  }
]