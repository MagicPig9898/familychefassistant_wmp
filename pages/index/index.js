const loginApi = require('../../utils/login');
const app = getApp();

Page({
  data: {
    userInfo: null,
    loginInfo: null,

    // 分类列表
    categories: [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' }
    ],

    // 当前选中的分类
    currentCategoryId: 1,

    // 所有菜品（模拟数据）
    allFoods: [
      { id: 1, name: 'A1', price: 38, categoryId: 1 },
      { id: 2, name: 'A2', price: 28, categoryId: 1 },
      { id: 3, name: 'B1', price: 12, categoryId: 2 },
      { id: 4, name: 'B2', price: 15, categoryId: 2 },
      { id: 5, name: 'C1', price: 5, categoryId: 3 },
      { id: 6, name: 'C2', price: 5, categoryId: 3 }
    ],

    // 当前展示的菜品
    foods: [
      { id: 1, name: 'A1', price: 38, categoryId: 1 },
      { id: 2, name: 'A2', price: 28, categoryId: 1 }
    ]
  },

  // onLoad 当页面加载时自动执行，只会执行一次
  onLoad() {
    console.log('首页准备加载...');
    // 页面加载时检查是否已授权
    this.checkAuth();
    // 恢复登录信息
    loginApi.revertLoginInfo();
    console.log('首页加载了');
  },

  // onShow 当页面显示时自动执行，每次进入页面都会执行
  onShow() {
    console.log('首页准备显示...');
    if (!app.globalData.loginInfo) {
      console.log("没有登录过，直接跳转去登录页")
      wx.switchTab({ url: '/pages/myself/myself' });
      return;
    } 
    this.setData({
      userInfo: app.globalData.userInfo,
      loginInfo: app.globalData.loginInfo 
    });
    console.log('首页显示了');
  },

  // 点击分类
  selectCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      currentCategoryId: id
    });
    this.filterFoods();
  },

  // 根据分类筛选菜品
  filterFoods() {
    const { allFoods, currentCategoryId } = this.data;
    const foods = allFoods.filter(item => item.categoryId === currentCategoryId);
    this.setData({
      foods
    });
  },

  // 检查授权，登录
  checkAuth() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo  
      });
      return;
    }
    if (!app.globalData.userInfo) {  
      const sUserInfo = wx.getStorageSync('userInfo')
      if (sUserInfo) {
        app.globalData.userInfo = sUserInfo
        console.log("从硬盘恢复授权信息")
        this.setData({
          userInfo: app.globalData.userInfo  
        });
      } else {
        // 未授权，弹窗授权
        this.showAuthModal();
      }
    }
  },

  // 显示授权弹窗
  showAuthModal() {
    wx.showModal({
      title: '提示',
      content: '需要获取您的用户信息才能使用完整功能',
      success: (res) => {
        if (res.confirm) {
          // 用户点击确定，调用微信授权
          loginApi.getUserProfile();
        } else {
          // 用户取消，可以再次提醒或退出
          wx.showToast({
            title: '需要授权才能使用完整功能',
            icon: 'none'
          });
        }
      }
    });
  },
})