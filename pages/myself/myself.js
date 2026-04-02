// pages/myself/myself.js
const loginApi = require('../../utils/login');
const app = getApp();
Page({
  
  /**
   * 页面的初始数据, 当页面初始化时会执行一次
   */
  data: {
      userInfo: null,
      loginInfo: null
  },

  // 点击登录
  handleLogin() {
   // 获取登录凭证 code
   wx.login({
    success: (loginRes) => {
      const code = loginRes.code;
      console.log("code = "+ code)
      app.globalData.userInfo = 
      wx.request({
        url: 'http://localhost:8080/api/v1/users/wxlogin',
        method: 'POST',
        data: {
          code: code,
          nick_name: app.globalData.userInfo ? app.globalData.userInfo.nickName : '',
          avatar_url: app.globalData.userInfo ? app.globalData.userInfo.avatarUrl : '',
          gender: app.globalData.userInfo ? app.globalData.userInfo.gender : 0,
          city: app.globalData.userInfo ? app.globalData.userInfo.city : '',
          country: app.globalData.userInfo ? app.globalData.userInfo.country : ''
        },
        success: (res) => {
          if (res.statusCode === 200) {
            if (res.data != null && res.data.code == 0) {
              console.log('登录成功, logininfo = ', res.data.data)
              app.globalData.loginInfo = res.data.data;  // 内存中，小程序关闭就丢失
              wx.setStorageSync(res.data.data);  // 手机硬盘里，永久保存，除非主动删除
              this.onShow();  // 重新走生命周期
            } else {
              console.log("res.statusCode = " + res.statusCode + ", code = " + res.data.code + ", msg = " + res.data.msg)
            }
          } else {
            console.log("res = " + res)
            wx.showToast({
              title: '登录失败',
              icon: 'none'
            })
          }
        },
        fail: (err) => {
          console.log('请求后端登录接口失败：', err)
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          })
        }
      });
    },
    fail: () => {
      console.log('获取登录code失败')
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      });
    }
   });
  },

  /**
   * 生命周期函数--onLoad：页面“创建时”执行（一次）
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--页面“被看到时”执行（多次）
   */
  onShow() {
    console.log('myself页面准备显示...');
    this.setData({
      userInfo: app.globalData.userInfo,
      loginInfo: app.globalData.loginInfo 
    });
    console.log('myself页面显示了');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {}
})