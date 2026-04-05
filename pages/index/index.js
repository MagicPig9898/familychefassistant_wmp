const loginApi = require('../../utils/login');
const app = getApp();
 
Page({
  data: {
    userInfo: null,
    loginInfo: null,

    aiBtnX: 280,  // 初始 x 坐标（单位 px，可按屏幕宽度调整）
    aiBtnY: 300,  // 初始 y 坐标

    // 分类列表
    categories: [
      {
        id: 1,
        name: '食材大全',
        children: [
          { id: 101, name: '蔬菜' },
          { id: 102, name: '肉类' },
          { id: 103, name: '生鲜' },
          { id: 104, name: '菌类' },
          { id: 105, name: '螃蟹' },
          { id: 106, name: '贝类' },
          { id: 107, name: '虾类' }
        ]
      }
    ],
    expandedCategoryId: null,
    currentSubCategoryId: null,

    // 所有菜品（模拟数据）
    allFoods: [
      { id: 1, name: '白菜', price: 38, subCategoryId: 101, image: '/images/ai-icon.png' },
      { id: 2, name: '猪下水', price: 10, subCategoryId: 102, image: '/images/ai-icon.png' },
      { id: 3, name: '猪里脊', price: 28, subCategoryId: 102, image: '/images/ai-icon.png' },
      { id: 4, name: '鲈鱼', price: 12, subCategoryId: 103, image: '/images/ai-icon.png' },
      { id: 5, name: '信鲍菇', price: 15, subCategoryId: 104, image: '/images/ai-icon.png' },
      { id: 6, name: '梭子蟹', price: 15, subCategoryId: 105, image: '/images/ai-icon.png' },
      { id: 7, name: '花甲', price: 5, subCategoryId: 106, image: '/images/ai-icon.png' },
      { id: 8, name: '基围虾', price: 5, subCategoryId: 107, image: '/images/ai-icon.png' }
    ],

    // 当前展示的菜品
    foods: []
  },

  // onLoad 当页面加载时自动执行，只会执行一次
  onLoad() {
    console.log('首页准备加载...');
    // 页面加载时检查是否已授权
    this.checkAuth();
    // 恢复登录信息
    loginApi.revertLoginInfo();
    this.initDefaultCategorySelection();
    console.log('首页加载了');
  },

  // onShow 当页面显示时自动执行，每次进入页面都会执行
  onShow() {
    console.log('首页onshow...');
    if (!app.globalData.loginInfo) {
      console.log("没有登录，提示先登录")
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
    } 
    this.setData({
      userInfo: app.globalData.userInfo,
      loginInfo: app.globalData.loginInfo 
    });
    console.log(this.loginInfo)
    console.log('首页onshow end');
  },

  // 点击 AI 按钮
  onAiBtnTap() {
    console.log('点击了 AI 按钮');
    wx.navigateTo({
      url: '/pages/ai/ai'
    });
  },

  initDefaultCategorySelection() {
    const { categories } = this.data;
    if (!categories || !categories.length) {
      return;
    }
    const firstCategory = categories[0];
    const children = firstCategory.children || [];
    const vegetableCategory = children.find(item => item.name === '蔬菜');
    const defaultSubCategoryId = vegetableCategory
      ? vegetableCategory.id
      : (children.length ? children[0].id : null);
    this.setData({
      expandedCategoryId: firstCategory.id,
      currentSubCategoryId: defaultSubCategoryId
    });
    this.filterFoods();
  },

  // 点击一级分类
  toggleCategory(e) {
    const id = e.currentTarget.dataset.id;
    const { expandedCategoryId, categories } = this.data;
    if (expandedCategoryId === id) {
      this.setData({
        expandedCategoryId: null,
        currentSubCategoryId: null,
        foods: []
      });
      return;
    }
    const selectedCategory = categories.find(item => item.id === id);
    const firstSubCategoryId = selectedCategory && selectedCategory.children && selectedCategory.children.length
      ? selectedCategory.children[0].id
      : null;
    this.setData({
      expandedCategoryId: id,
      currentSubCategoryId: firstSubCategoryId
    });
    this.filterFoods();
  },

  // 点击二级分类
  selectSubCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      currentSubCategoryId: id
    });
    this.filterFoods();
  },

  // 根据二级分类筛选菜品
  filterFoods() {
    const { allFoods, currentSubCategoryId } = this.data;
    if (!currentSubCategoryId) {
      this.setData({
        foods: []
      });
      return;
    }
    const foods = allFoods
      .filter(item => item.subCategoryId === currentSubCategoryId)
      .slice(0, 5);
    this.setData({
      foods
    });
  },

  onFoodDetailTap() {},

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
          console.log("用户同意授权")
          loginApi.getUserProfile();
        } else {
          // 用户取消，可以再次提醒或退出
          console.log("用户取消授权")
          wx.showToast({
            title: '需要授权才能使用完整功能',
            icon: 'none'
          });
        }
      }
    });
  },
})
