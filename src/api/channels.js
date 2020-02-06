import request from '@/utils/request'

// 指定用户频道列表
export const userChannels = () => {
  return request({
    url: '/app/v1_0/user/channels',
    Method: 'GET'
  })
}

// 全部频道列表
export const AllChannels = () => {
  return request({
    url: '/app/v1_0/channels',
    Method: 'GET'
  })
}
