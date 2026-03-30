// 程序入口
// getApp() 是小程序提供的全局函数，用来获取 app.js 中定义的 App() 实例
App({
  // 小程序第一次启动时执行，仅执行一次
  onLaunch() {
    console.log('小程序启动了');
  },

  // 小程序启动后 或 从后台切换到前台时执行
  onShow() {
    console.log('小程序进入前台');
  },

  // app.js 里不能直接弹窗，因为：app.js 执行时页面还没加载完成，弹窗需要页面 DOM 支持，但此时页面还没渲染
  // 但是可以存储全局数据
  // 全局数据
  globalData: {
    userInfo: null,
    loginInfo: null
  }
})