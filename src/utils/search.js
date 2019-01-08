import { request } from '@/utils/utils'
import { api } from '@/config/config'
export default function search (k) {
  request(api.search+k+'&limit=15').then(res=>{
    if (res.result.songs) {
      this.results = res.result.songs
    } else {
      this.results = ''
    }
    return request(api.search+k+'&type=100&limit=1')
    
  }).then(res => {
    if (res.result.artists[0]) {
      this.singer = res.result.artists[0]
    } else {
      this.singer = ''
    }
    return request(api.search+k+'&type=1000&limit=1')
  }).then(res => {
    if (res.result.playlists[0]) {
      this.playLists = res.result.playlists[0]
    } else {
      this.playLists = ''
    }
  })
} 
