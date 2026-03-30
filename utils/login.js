/* utils/login.js */
// 模拟openid
const OPENID = "lfasjdlkgjlaisdfujgoijadslfjasdlkfja";
// 👉 token 过期时间（单位：毫秒）这里设置 2 小时
// const EXPIRE_TIME = 2 * 60 * 60 * 1000;
const EXPIRE_TIME = 20 * 1000  // 10秒

/**
 * 模拟生成 token
 * token 本质：base64(openid + 过期时间)
 */
function generateToken(openid) {
  const expireAt = Date.now() + EXPIRE_TIME;
  const tokenObj = {
    openid,
    expireAt
  };
  // 转字符串再 base64 编码
  const token = wx.arrayBufferToBase64(
    new TextEncoder().encode(JSON.stringify(tokenObj))
  );
  return token;
}

/**
 * 模拟解析 token
 */
function parseToken(token) {
  try {
    const jsonStr = new TextDecoder().decode(
      wx.base64ToArrayBuffer(token)
    );
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}

/**
 * 模拟校验 token 是否有效
 */
function isTokenValid(token) {
  const data = parseToken(token);
  if (!data) return false;
  return data.expireAt > Date.now();
}

/**
 * 模拟 HTTP 登录接口
 * @param {string} code
 */
function mockLogin(code) {
  console.log("模拟登录...")
 
    console.log("收到 code:", code);
    // 模拟网络延迟
    if (!code) {
      // 模拟 HTTP 400
      return {
        statusCode: 400,
        data: {}
      };
      return;
    }
    // 成功情况
    const token = generateToken(OPENID);
    const authoritys = [
      { organization: "family1", role: "chefs" },
      { organization: "family2", role: "foodies" }
    ];
    return  {
      statusCode: 200,
      data: {
        openid: OPENID,
        token: token,
        authoritys: authoritys
      }
    };
}

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
      wx.showToast({
        title: '授权成功',
        icon: 'success'
      });
      wx.switchTab({ url: '/pages/myself/myself' });
    },
    fail: () => {  // 请求拒绝或失败的回调
      wx.showToast({
        title: '授权失败',
        icon: 'none'
      });
      // 跳转到我的页面
      console.log("跳转到myself页面")
      wx.switchTab({ url: '/pages/myself/myself' });
    }
  });
}

// 恢复授权信息，用于当重新进入小程序时，恢复全局变量
function revertUserInfo() {
  const app = getApp();
  if (!app.globalData.userInfo) {
    const sUserInfo = wx.getStorageSync('userInfo')
    if (sUserInfo) {
      app.globalData.userInfo = sUserInfo
    }
    // 没有授权信息也不影响
  }
}

function isLogined() {
  const app = getApp();
  if (app.globalData.loginInfo) {
    return true
  } else {
    const sloginInfo = wx.getStorageSync('loginInfo') 
    if (sloginInfo) {
      console.log("从硬盘恢复登录信息...")
      app.globalData.loginInfo = sloginInfo
      return true
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return false
    }
  }
}

module.exports = {
  mockLogin,
  generateToken,
  parseToken,
  isTokenValid,
  getUserProfile,
  revertUserInfo,
  isLogined
};