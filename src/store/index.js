import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
import decodeJwt from 'jwt-decode'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getItem('user'),
    cachePage: ['tabBar']
  },
  mutations: {
    onSetItem (state, data) {
      if (data && data.token) {
        data.id = decodeJwt(data.token).user_id
      }
      state.user = data
      setItem('user', state.user)
    },
    // 增加缓存
    addCachePage (state, name) {
      if (!state.cachePage.includes(name)) {
        state.cachePage.push(name)
      }
    },
    // 删除缓存
    delCachePage (state, name) {
      let index = state.cachePage.indexOf(name)
      if (index !== -1) {
        state.cachePage.splice(index)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
