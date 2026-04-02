Page({
  onBackHome() {
    wx.navigateBack({
      delta: 1,
      fail: () => {
        wx.reLaunch({
          url: '/pages/index/index'
        });
      }
    });
  }
});
