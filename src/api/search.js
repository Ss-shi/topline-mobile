import request from '@/utils/request'

export const getSuggestions = q => {
  return request({
    url: '/app/v1_0/suggestion',
    method: 'GET',
    params: { q }
  })
}

export const getSearch = params => {
  return request({
    url: '/app/v1_0/search',
    method: 'GET',
    params
  })
}
