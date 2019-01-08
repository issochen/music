<template>
  <div>
    <div
      class="songs-bg"
      :style="{ backgroundImage: playList.coverImgUrl }"
    >
      <div class="songs-desc">
        <div class="desc-title one-txt-cut">{{playList.name}}</div>
        <div class="num" v-if="playList.playCount > 0"><i class="iconfont num-icon">&#xe6a8;</i>{{playList.playCount}}</div>
      </div>
    </div>
    <div class="songs">
      <div class="title">
        <i class="iconfont play-icon">&#xe696;</i>
        播放全部<span>(共{{playList.trackCount}}首)</span>
      </div>
      <div
        v-for="(item, index) of playList.tracks"
        :key="index"
        class="item"
        @click="navigateToPlayer(item)"
      > 
        <div class="order">{{index+1}}</div>
        <div class="desc">
          <div class="song-name one-txt-cut">{{item.name}}</div>
          <div class="singer-name one-txt-cut">
            <span v-for="(v, i) of item.ar" :key="i">{{v.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <small-player v-if="curSong.id?true: false"></small-player>
  </div>
</template>

<script>
import SmallPlayer from '@/components/SmallPlayer'
import { getOptions } from '@/utils/utils'
import { request } from '@/utils/utils'
import { api } from '@/config/config'
import { mapState, mapMutations } from 'vuex'
import { PLAY, ADD_LIST } from '../../store/mutation-types'
export default {
  name: 'Songs',
  data () {
    return {
      playList: {}
    }
  },
  components: {
    SmallPlayer
  },
  computed: {
    ...mapState(['songList', 'curSong'])
  },
  methods: {
    ...mapMutations([
        PLAY, ADD_LIST
    ]),
    navigateToPlayer (i) {
      console.log(i)
      let al = i.al,
          ar = i.ar,
          id = i.id,
          name = i.name;
      let list = {al,ar,id,name}
      this[PLAY](list)
      let flag = true
      this.songList.forEach(item => {
        if (item.id === list.id) {
          flag = false
          return
        }
      })
      if (flag) {
        this[ADD_LIST]([list])
      }
      let url = `../Player/main?id=${i.id}`
      wx.navigateTo({ url })
    }
  },
  async mounted () {
    let options = getOptions()
    let id = options.id
    let flag = options.flag
    if (!flag) {
      await request(api.playList+id).then(res=>{
        let playCount = parseInt(res.playlist.playCount / 10000) + '万' 
        let coverImgUrl = `url(${res.playlist.coverImgUrl})`
        this.playList = {...res.playlist, playCount, coverImgUrl }
        //删选出 想要的信息 存储在 store中
        let list = this.playList.tracks.map(item => {
          let al = item.al,
              ar = item.ar,
              id = item.id,
              name = item.name;
          let value = {al, ar, id, name }
          return value
        })
        this[ADD_LIST](list)
      })
    } else {
      await request(api.artist+id).then(res => {
        let playCount = -1
        let coverImgUrl = `url(${res.artist.picUrl})`
        let playlist = {name: res.artist.name, tracks: res.hotSongs}
        this.playList = {...playlist, playCount, coverImgUrl }
        //删选出 想要的信息 存储在 store中
        let list = this.playList.tracks.map(item => {
          let al = item.al,
              ar = item.ar,
              id = item.id,
              name = item.name;
          let value = {al, ar, id, name }
          return value
        })
        this[ADD_LIST](list)
      })
    }
    

  }
}
</script>

<style lang='stylus' scoped>
  .songs-bg
    position relative
    overflow hidden
    height 0
    padding-bottom 75%
    background-repeat no-repeat
    background-position center
    background-size cover
    .songs-desc
      position absolute
      bottom 100rpx
      width 100%
      color #fff
      padding-left 20rpx
      .desc-title
        font bold 30rpx/40rpx '微软雅黑'
      .num
        display flex
        font 24rpx/40rpx '微软雅黑'
        .num-icon
          font-size 24rpx
          margin 0 10rpx 0 10rpx
  .songs
    position relative
    overflow hidden
    top -100rpx
    border-radius 30rpx 30rpx 0 0
    background #f2f3f4
    .title
      display flex
      height 80rpx
      line-height 80rpx
      font-size 34rpx
      border-bottom 2rpx solid #e4e4e4
      background #fff
      .play-icon
        font-size 34rpx
        margin 0 30rpx 0
      span
        color #757575
        font-size 28rpx
        margin-left 10rpx
    .item
      overflow hidden
      height 120rpx
      color #757575
      border 2rpx solid #e4e4e4
      .order
        float left
        width 10%
        text-align center
        line-height 120rpx
      .desc
        float left
        width 90%
        padding 20rpx 0
        .song-name
          color #000
          font 30rpx/40rpx '微软雅黑'
          padding-right 20rpx
        .singer-name
          font 30rpx/40rpx '微软雅黑'
          span
            margin-right 16rpx
</style>
