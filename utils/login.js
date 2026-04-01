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
 * 校验 token 是否有效（调用后端接口）
 * @param {string} token
 * @returns {Promise<{valid: boolean, newToken: string|null}>}
 */
function isTokenValid(token) {
  return new Promise((resolve) => {
    wx.request({
      url: 'http://localhost:8080/api/v1/users/validtoken',
      method: 'POST',
      data: { token: token },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log("校验token成功：", res.data);
          resolve({ valid: true, newToken: res.data.token || null });
        } else {
          resolve({ valid: false, newToken: null });
        }
      },
      fail: (err) => {
        console.log('校验token请求失败：', err);
        resolve({ valid: false, newToken: null });
      }
    });
  });
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
  mockLogin,
  generateToken,
  parseToken,
  isTokenValid,
  getUserProfile,
  revertLoginInfo
};