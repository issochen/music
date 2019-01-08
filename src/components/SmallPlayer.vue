<template>
  <div class="small-player">
    <div class="small-disc" @click="toPlay">
      <div
        class="img-wrapper"
        :style="{animationPlayState: animation}"
      >
        <image
          class="small-img"
          :src="curSong.al.picUrl"
          mode="aspectFill"
        />
      </div>
    </div>
    <div class="small-title" @click="toPlay">
      <div class="song-name one-txt-cut">{{curSong.name}}</div>
      <div class="singer-name one-txt-cut">{{curSong.ar[0].name}}</div>
    </div>
    <div class="small-btn">
      <i class="item" @click="stop">
        <i class="iconfont play-icon" v-if="flag">&#xe6ca;</i>
        <i class="iconfont play-icon" v-else>&#xe696;</i>
      </i>
      <i class="iconfont item" @click="showList">&#xe649;</i>
    </div>
    <song-list
      :songlistFlag="songlistFlag"
      :songlistTrans="songlistTrans"
      @close="showList"
    >
    </song-list>
  </div>
</template>

<script>
import SongList from '@/components/SongList'
import { mapState, mapMutations } from 'vuex'
import { AUDIO } from '@/store/mutation-types'
export default {
  name: 'SmallPlayer',
  data () {
    return {
      songlistFlag: false,
      songlistTrans: 'scale(0)',
      flag: true,
      animation: 'running'
    }
  },
  components: {
    SongList
  },
  computed: {
    ...mapState(['curSong', 'songList', 'audio'])
  },
  watch: {
    audio (newV, oldV) {
      this.flag = newV.flag
      this.animation = newV.animation
    }
  },
  methods: {
    ...mapMutations([AUDIO]),
    stop () {
      if (this.curSong.id) {  // 如果 当前 有播放 信息 
        if (this.audio.flag) {
          //暂停 播放
          wx.showToast({
            title: '已为您暂停播放',
            icon: 'success',
            duration: 2000
          })
          this.audio.AudioContext.pause()
          let v = {...this.audio, flag: false, animation: 'paused'}
          this[AUDIO](v)
        } else {
          wx.showToast({
            title: `已为您开启播放`,
            icon: 'success',
            duration: 2000
          })
          this.audio.AudioContext.play()
          let v = {...this.audio, flag: true, animation: 'running'}
          this[AUDIO](v)
        } 
      } else {  //如果 没有 播放信息  不执行 暂停功能
        wx.showModal({
          title: '嘲笑',
          content: '你怕是个逗比，没有音乐信息 还点播放按钮 ！！！！！！'
        })
      }
    },
    showList (v) {
      this.songlistFlag = !this.songlistFlag
      if (v === 1) {
        this.songlistTrans = 'scale(0)'
      } else {
        this.songlistTrans = 'scale(1)'
      } 
    },
    toPlay () {
      wx.navigateTo({
        url: '../Player/main'
      })
    }
  }
}
</script>


<style lang="stylus" scoped>
  .small-player
    position fixed
    bottom 0
    left 0
    right 0
    height 120rpx
    background #d43c33
    .small-disc
      float left
      width 120rpx
      height 100%
      padding 20rpx
      box-sizing border-box
      .img-wrapper
        overflow hidden
        width 80rpx
        height 80rpx
        border-radius 50%
        animation myrotate 20s linear infinite
      .small-img
        width 100%
        height 100%
    .small-title
      float left
      width 390rpx
      height 100%
      line-height 60rpx
      color #fff
      .song-name
        font-size 30rpx
      .singer-name
        font-size 26rpx
    .small-btn
      float left
      overflow hidden
      width 240rpx
      height 100%
      text-align center
      color #fff
      .item
        float left
        width 50%
        font 50rpx/120rpx '微软雅黑'
        .play-icon
          font-size 80rpx
</style>

<style>
@keyframes myrotate{
  0% {transform: rotate(0)}
  100% {transform: rotate(360deg)}
}

</style>