import request from '@/utils/request'

export const getArticleList = (userId, params) => {
  return request({
    url: `/app/v1_0/users/${userId}/articles`,
    method: 'GET',
    params
  })
}

export const getChannelArticleList = params => {
  return request({
    url: '/app/v1_1/articles',
    method: 'GET',
    params
  })
}

export const getArticleById = articleId => {
  return request({
    url: `/app/v1_0/articles/${articleId}`,
    method: 'GET'
  })
}

export const addCollect = articleId => {
  return request({
    url: '/app/v1_0/article/collections',
    method: 'POST',
    data: {
      target: articleId
    }
  })
}

export const deleteCollect = articleId => {
  return request({
    url: `/app/v1_0/article/collections/${articleId}`,
    method: 'DELETE'
  })
}

export const addLike = articleId => {
  return request({
    url: '/app/v1_0/article/likings',
    method: 'POST',
    data: {
      target: articleId
    }
  })
}

export const deleteLike = articleId => {
  return request({
    url: `/app/v1_0/article/likings/${articleId}`,
    method: 'DELETE'
  })
}
