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
      const res = loginApi.mockLogin(code);
      if (res.statusCode == 200) {
        console.log('登录成功：', res.data)
        app.globalData.loginInfo = res.data;  // 内存中，小程序关闭就丢失
        wx.setStorageSync('loginInfo', res.data);  // 手机硬盘里，永久保存，除非主动删除
        this.onShow();  // 重新走生命周期
      } else {
        console.log("statusCode = " + res.statusCode)
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
      // wx.request({
        // url: 'https://127.0.0.1:8082/login',
        // method: 'POST',
        // data: {
        //   code: code
        // },
        // success: (result) => {
        //   console.log('后端返回：', result.data)
        // },
        // fail: () => {
        //   console.log("请求login接口失败")
        //   wx.showToast({
        //     title: '登录失败',
        //     icon: 'none'
        //   });
        // }
      // });
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
  onReady() {

  },

  /**
   * 生命周期函数--页面“被看到时”执行（多次）
   */
  onShow() {
    loginApi.revertUserInfo();
    if (loginApi.isLogined()) {
      // 判断是否过期
      if (!loginApi.isTokenValid(app.globalData.loginInfo.token)) {
        console.log("登录已过期，请重新登录")
        wx.showToast({
          title: '登陆已过期，请重新登录',
          icon: 'none'
        });
        app.globalData.loginInfo = null
      }
    }
    this.setData({
      userInfo: app.globalData.userInfo,
      loginInfo: app.globalData.loginInfo
    });
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