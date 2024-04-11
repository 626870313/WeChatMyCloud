export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/detail/index',
    'pages/nofilesfolder/index',
    'pages/login/index',
    'pages/phone/index',
    'pages/code/index',
    'pages/newfile/index',
    'pages/register/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar:{
    color:'#8a8a8a',
    selectedColor:'#FF0000',
    backgroundColor:'#fafafa',
    borderStyle:'black',
    position:'bottom',
    list:[
      {
        pagePath:'pages/index/index',
        iconPath:'./static/tabBar/home.jpg',
        selectedIconPath:'./static/tabBar/home-active.jpg',
        text:'资源库'
      },
      {
        pagePath:'pages/detail/index',
        iconPath:'./static/tabBar/message.jpg',
        selectedIconPath:'./static/tabBar/message-active.jpg',
        text:'我的'
      }
    ]
  }
})
