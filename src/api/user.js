import request from '@/utils/request'
// 获取验证码
export const getSmsCode = mobile => {
  return request({
    url: `/app/v1_0/sms/codes/${mobile}`,
    method: 'GET'
  })
}
// 用户登录
export const onlogin = data => {
  return request({
    url: '/app/v1_0/authorizations',
    method: 'POST',
    data
  })
}
// 获取当前用户信息
export const getUserInfo = () => {
  return request({
    url: '/app/v1_0/user',
    method: 'GET'
  })
}

// 获取指定用户信息
export const getUserById = userId => {
  return request({
    url: `/app/v1_0/users/${userId}`,
    method: 'GET'
  })
}

// export const addFollow = target => {
//   return request({
//     url: '/app/v1_0/user/followings',
//     method: 'POST',
//     data: {
//       target
//     }
//   })
// }

// 关注
export const addFollow = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

export const deleteFollow = userId => {
  return request({
    url: `/app/v1_0/user/followings/${userId}`,
    method: 'DELETE'
  })
}

// 获取用户信息
export const getUserProfile = () => {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'GET'
  })
}

export const updateUserPhoto = data => {
  return request({
    url: '/app/v1_0/user/photo',
    method: 'PATCH',
    data
  })
}

// 编辑用户个人资料
export const updateUserProfile = data => {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}

// 获取用户收藏列表
export const getUserCollect = data => {
  return request({
    url: '/app/v1_0/article/collections',
    method: 'GET',
    data
  })
}

// 获取用户文章列表
export const getUserArticle = data => {
  return request({
    url: '/app/v1_0/user/articles',
    method: 'GET',
    data
  })
}

// 获取用户阅读历史
export const getUserHistory = data => {
  return request({
    url: '/app/v1_0/user/histories',
    method: 'GET',
    data
  })
}
