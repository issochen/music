<template>
  <div>
    <div class="title">推荐歌曲</div>
    <div class="content">
      <div
        class="item"
        v-for="(item, index) of songs"
        :key="index"
        @click="toPlayer(item)"
      >
        <div class="img-wrapper">
          <image
          class="item-img"
          :src="item.song.album.picUrl"
          mode="aspectFill"
          lazy-load="true"
          />
        </div> 
        <div class="item-desc">{{item.song.name}}</div>
        <div class="singer">{{item.song.album.artists[0].name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '@/utils/utils'
import { api } from '@/config/config'
import { mapMutations, mapState } from 'vuex'
import { PLAY, ADD_LIST } from '@/store/mutation-types'
export default {
  name: 'RecomSongs',
  data () {
    return {
      songs: []
    }
  },
  async mounted () {
    await request(api.newsong).then(res=>{
      this.songs = res.result
    })
  },
  computed: {
    ...mapState([
      'songList'
    ])
  },
  methods: {
    ...mapMutations([ PLAY, ADD_LIST ]),
    toPlayer (i) {
      let picUrl = i.song.album.blurPicUrl,
          al = {picUrl},
          id = i.song.id,
          name = i.song.name,
          ar = i.song.album.artists;
      let list = {al,ar,id,name}
      this[PLAY] (list)
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
      wx.navigateTo({ 
        url: '../Player/main'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.title
  position relative
  height 80rpx
  line-height 80rpx
  font-size 30rpx
  padding-left 30rpx
  border-bottom 2rpx solid #ccc
  margin-bottom 20rpx
  &:before
    content: ''
    position absolute
    left 0
    top 25rpx
    height 30rpx
    width 6rpx
    background #d43c33
.content
  display flex
  justify-content space-around
  flex-wrap wrap
  .item
    width 32%
    height 360rpx
    .img-wrapper
      position relative
      overflow hidden
      width 100%
      height 70%
      .item-img
        width 100%
        height 100%
    .item-desc, .singer
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
      height 40rpx
      font 28rpx/40rpx '微软雅黑'
    .singer
      color #757575
</style>