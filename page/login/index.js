/**
 * 目标1：验证码登录
 * 1.1 在 utils/request.js 配置 axios 请求基地址
 * 1.2 收集手机号和验证码数据
 * 1.3 基于 axios 调用验证码登录接口
 * 1.4 使用 Bootstrap 的 Alert 警告框反馈结果给用户
 */

document.querySelector('.btn').addEventListener('click', function () {
  const formObj = document.querySelector('.login-form')
  const data = serialize(formObj, { hash: true, empty: true })
  const res = axios({
    url: '/v1_0/authorizations',
    method: 'POST',
    data
  }).then(res => {
    myAlert(true, '登录成功')
    //存储服务器返回的token
    localStorage.setItem('token', res.data.token)
    setTimeout(() => {
      location.href = '../content/index.html'
    }, 1500)
  }).catch(err => {
    myAlert(false, err.response.data.message)
  })
})