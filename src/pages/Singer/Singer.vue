<template>
  <scroll-view
    class="main"
    scroll-y="true"
    enable-back-to-top="true"
    @scroll="scroll"
    :scroll-top="top"
  > 
    <div class="content" v-for="(item, index) of singers" :key="index">
      <div class="title">{{item.title}}</div>
      <div
        class="item"
        v-for="(v, i) of item.singer"
        :key="i"
        @click="navigate(v.id)"
      >
        <div class="singer-img-wrapper">
          <image class="singer-img" :src="v.picUrl" />
        </div>
        <div class="singer-name">{{v.name}}</div>
      </div>
    </div>
    <div class="fix-title">{{title}}</div>
    <singer-asider
      :singers="singers"
      :flag="flag"
      @index = "fromChild"
    >
    </singer-asider>
    <small-player v-if="curSong.id?true: false"></small-player>
  </scroll-view>
</template>

<script>
import SmallPlayer from '@/components/SmallPlayer'
import { mapState } from 'vuex'
import { request } from '@/utils/utils'
import { api } from '@/config/config'
import { format } from '@/utils/Convert_Pinyin'
import { scroll, num } from '@/utils/scroll'
import SingerAsider from './components/SingerAsider'
export default {
  name: 'Singer',
  components: {
    SingerAsider,
    SmallPlayer
  },
  data () {
    return {
      singers: [],
      title: '热门',
      flag: 0,
      top: 300
    }
  },
  computed: {
    ...mapState(['curSong', 'songList'])
  },
  methods: {
    scroll (e) {
      scroll.call(this, e)
    },
    fromChild(data) {
      if (data === 0 ) {
        this.top = 0
      }
      this.top = num[data-1]
    },
    navigate (id) {
      const url = `../Songs/main?id=${id}&flag=singer`
      wx.navigateTo({ url })
    }
  },
  async mounted () {
    await request(api.singers).then(res => {
      this.singers = format(res.list.artists)
    })
  }
}
</script>

<style lang="stylus" scoped>
.main
  height 1330rpx
  .fix-title
    position fixed
    top 0
    width 100%
    height 40rpx
    font 30rpx/40rpx '微软雅黑'
    text-indent 20rpx
    color #fff
    background rgba(0,0,0,.5)
  .title
    height 40rpx
    font 30rpx/40rpx '微软雅黑'
    text-indent 20rpx
    color #fff
    background rgba(0,0,0,.2)
  .item
    display flex
    align-items center
    height 160rpx
    border-bottom 2rpx solid #e4e4e4
    .singer-img-wrapper
      overflow hidden
      width 140rpx
      height 140rpx
      border-radius 14rpx
      margin-left 10rpx
      .singer-img
        width 100%
        height 100%
    .singer-name
      flex 1
      text-indent 30rpx
</style>
