/* utils/login.js */

// 授权：获取用户头像和昵称
function getUserProfile() {
  const app = getApp();
  // 这是微信小程序获取用户头像和昵称的官方方法
  wx.getUserProfile({
    desc: '用于完善用户资料',  // 必填，声明用途
    success: (res) => {    // 请求成功的回调
      console.log('授权成功，用户信息：', res.userInfo);  // {nickName: "微信用户", gender: 0, language: "", city: "", province: "", …}
      // 保存用户信息
      app.globalData.userInfo = res.userInfo;  // 内存中，小程序关闭就丢失
      wx.setStorageSync('userInfo', res.userInfo);  // 手机硬盘里，永久保存，除非主动删除
      // 保存授权信息
      wx.showToast({
        title: '授权成功',
        icon: 'success'
      });
    },
    fail: () => {  // 请求拒绝或失败的回调
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      });
    }
  });
}

// 恢复登录信息，用于当重新进入小程序时，恢复全局变量
function revertLoginInfo() {
  const app = getApp();
  if (!app.globalData.loginInfo) {
    const sloginInfo = wx.getStorageSync('loginInfo')
    if (sloginInfo) {
      app.globalData.loginInfo = sloginInfo
      console.log("登录恢复")
    }
  }
}

module.exports = {
  getUserProfile,
  revertLoginInfo
};