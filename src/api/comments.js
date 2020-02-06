import request from '@/utils/request'

// 获取评论
export const getComments = params => {
  return request({
    url: '/app/v1_0/comments',
    method: 'GET',
    params
  })
}

// 发布评论
export const PostComments = data => {
  return request({
    url: '/app/v1_0/comments',
    method: 'POST',
    data
  })
}

// 对评论点赞
export const PostCommentsLike = target => {
  return request({
    url: ' /app/v1_0/comment/likings',
    method: 'POST',
    data: {
      target
    }
  })
}

// 取消对评论点赞
export const deleteCommentsLike = target => {
  return request({
    url: `/app/v1_0/comment/likings/${target}`,
    method: 'DELETE'
  })
}
