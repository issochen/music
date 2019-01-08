import { PLAY, ADD_LIST, REMOVE_LIST_ITEM, CLEAR_LIST, AUDIO } from './mutation-types'

export default {
  [ADD_LIST] (state, v) {
    state.songList = [ ...v, ...state.songList]
  },
  [PLAY] (state, v) {
    state.curSong = v
  },
  [REMOVE_LIST_ITEM] (state, v) {
    state.songList = state.songList.filter(item => {
                        return item.id !== v
                      })
  },
  [CLEAR_LIST] (state, v) {
    state.songList = []
  },
  [AUDIO] (state, v) {
    state.audio = v
  }
}