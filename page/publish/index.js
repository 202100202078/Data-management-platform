
/**
 * 目标1：设置频道下拉菜单
 *  1.1 获取频道列表数据
 *  1.2 展示到下拉菜单中
 */
function setChannelList() {
  axios({
    url: '/v1_0/channels'
  }).then(res => {
    const channelsArr = res.data.channels
    // console.log(channelsArr);
    document.querySelector('.form-select').innerHTML = `<option value="" selected="">请选择文章频道</option>` + channelsArr.map(channel => `<option value="${channel.id}">${channel.name}</option>`).join('')
  })
}
setChannelList()

/**
 * 目标2：文章封面设置
 *  2.1 准备标签结构和样式
 *  2.2 选择文件并保存在 FormData
 *  2.3 单独上传图片并得到图片 URL 网址
 *  2.4 回显并切换 img 标签展示（隐藏 + 号上传标签）
 */

document.querySelector('.img-file').addEventListener('change', async function () {
  const fd = new FormData()
  fd.append('image', this.files[0])
  const res = await axios({
    url: '/v1_0/upload',
    method: 'POST',
    data: fd
  })
  const curUrl = res.data.url
  document.querySelector('.rounded').src = curUrl
  document.querySelector('.rounded').classList.add('show')
  document.querySelector('.place').classList.add('hide')
})

document.querySelector('.rounded').addEventListener('click', () => {
  document.querySelector('.img-file').click()
})
/**
 * 目标3：发布文章保存
 *  3.1 基于 form-serialize 插件收集表单数据对象
 *  3.2 基于 axios 提交到服务器保存
 *  3.3 调用 Alert 警告框反馈结果给用户
 *  3.4 重置表单并跳转到列表页
 */

document.querySelector('.send').addEventListener('click', async () => {
  if (document.querySelector('.send').innerHTML == '修改') return
  const formObj = document.querySelector('.art-form')
  const imgUrl = document.querySelector('.rounded').src
  const formData = serialize(formObj, { hash: true, empty: true })
  // console.log(formData);
  delete formData.id
  // console.log(formData);

  formData.cover = {
    type: 1,
    images: [imgUrl]
  }
  try {
    const res = await axios({
      url: '/v1_0/mp/articles',
      method: 'POST',
      data: formData
    })
    formObj.reset()
    document.querySelector('.rounded').src = ''
    document.querySelector('.rounded').classList.remove('show')
    document.querySelector('.place').classList.remove('hide')
    myAlert(true, '发布成功')
    setTimeout(() => {
      location.href = '../content/index.html'
    }, 1500)
    editor.setHtml('')
  } catch (err) {
    myAlert(false, err.response.data.message)
    // console.dir(err);
  }
  // console.log(res);
})

  /**
   * 目标4：编辑-回显文章
   *  4.1 页面跳转传参（URL 查询参数方式）
   *  4.2 发布文章页面接收参数判断（共用同一套表单）
   *  4.3 修改标题和按钮文字
   *  4.4 获取文章详情数据并回显表单
   */

  ; (function () {
    const paramsStr = location.search
    console.log(paramsStr);
    const params = new URLSearchParams(paramsStr)
    params.forEach(async (value, key) => {
      if (key === 'id') {
        document.querySelector('.title span').innerHTML = '修改文章'
        document.querySelector('.send').innerHTML = '修改'
        const res = await axios({
          url: `/v1_0/mp/articles/${value}`
        })
        // console.log(res);
        // document.querySelector('#title').value = res.data.title
        // document.querySelector('#channel_id').value = res.data.channel_id
        // document.querySelector('.round')
        const dataObj = {
          channel_id: res.data.channel_id,
          title: res.data.title,
          rounded: res.data.cover.images[0],
          content: res.data.content,
          id: res.data.id
        }
        Object.keys(dataObj).forEach(key => {
          if (key === 'rounded') {
            if (dataObj[key]) {
              document.querySelector('.rounded').src = dataObj[key]
              document.querySelector('.rounded').classList.add('show')
              document.querySelector('.place').classList.add('hide')
            }
          } else if (key === 'content') {
            editor.setHtml(dataObj[key])
          } else {
            document.querySelector(`[name=${key}]`).value = dataObj[key]
          }
        })
      }
    })
  })();

/**
 * 目标5：编辑-保存文章
 *  5.1 判断按钮文字，区分业务（因为共用一套表单）
 *  5.2 调用编辑文章接口，保存信息到服务器
 *  5.3 基于 Alert 反馈结果消息给用户
 */
document.querySelector('.send').addEventListener('click', async () => {
  if (document.querySelector('.send').innerHTML === '发布') return
  //收集表单数据
  const formObj = document.querySelector('.art-form')
  const data = serialize(formObj, { hash: true, empty: true })
  // console.log(data);
  try {
    const res = await axios({
      url: `/v1_0/mp/articles/${data.id}`,
      method: 'PUT',
      data: {
        ...data,
        cover: {
          type: document.querySelector('.rounded').src ? 1 : 0,
          images: [document.querySelector('.rounded').src]
        }
      }
    })
    // console.log(res);
    myAlert(true, '文章修改成功')
    setTimeout(() => {
      location.href = '../content/index.html'
    }, 1500)
  } catch (error) {
    myAlert(false, error.response.data.message)
  }
})