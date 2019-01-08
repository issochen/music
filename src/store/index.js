import Vue from 'vue'
import Vuex from 'vuex'


import mutations from './mutations'
import actions from './actions'
import getters from './getters'


Vue.use(Vuex)

const state = {
  songList: [], // 整个 播放 列表 里面的 数据
  curSong: [],  // 当前播放列表的 数据
  audio: null  // 当前 播放 对象
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
