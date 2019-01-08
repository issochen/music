<template>
  <div>
    <scroll-view
      class="wrapper"
      scroll-y="true"
      enable-back-to-top="true"
    >
      <div
        class="item"
        v-for="(item, index) of topList"
        :key="index"
        @click="navigate(item.id)"
      >
        <image 
          :src="item.coverImgUrl"
          mode="aspectFill"
          lazy-load="true"
        />
        <div class="desc">
          <div class="desc-title">{{item.description}}</div>
          <div class="updata-time">更新时间：{{item.updateTime}}</div>
        </div>
        <div class="songs-item" v-for="(val, i) of item.tracks" :key="i" v-if="item.tracks.length > 0">
          <div class="num">{{ i+1 }}</div>
          <div class="content">
            <div class="song-name">
              {{val.first}}
            </div>
            <div class="singer-name">
              {{val.second}}
            </div>
          </div>
        </div>
      </div>
      <small-player v-if="curSong.id?true: false"></small-player>
    </scroll-view>
  </div>
</template>

<script>
import SmallPlayer from '@/components/SmallPlayer'
import { mapState } from 'vuex'
import { request } from '@/utils/utils'
import { api } from '@/config/config'

export default {
  name: 'Rank',
  data () {
    return {
      topList: []
    }
  },
  components: {
    SmallPlayer
  },
  computed: {
    ...mapState(['curSong', 'songList'])
  },
  async mounted () {
    await request(api.topListDetail).then(res => {
      let list = res.list.map(item => {
        let updateTime = new Date(item.updateTime).toLocaleDateString()
        return (
          {...item, updateTime}
        )
      })
      this.topList = list
    })
  },
  methods: {
    navigate (id) {
      const url = `../Songs/main?id=${id}`
      wx.navigateTo({ url }) 
    }
  }
} 
</script>

<style lang="stylus" scoped>
.wrapper
  height 1330rpx
  .item
    margin-bottom 20rpx
    image
      width 100%
      height 300rpx
    .desc
      overflow hidden
      font 24rpx/24rpx '微软雅黑'
      .desc-title
        float left
        width 60%
        height 24rpx
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
      .updata-time
        float right
    .songs-item
      overflow hidden
      height 100rpx
      .num
        float left
        color red
        width 10%
        font-size 40rpx
        text-align center
        line-height 100rpx
      .content
        width 90%
        float left
        border-bottom 2rpx solid #ccc
        .song-name
          line-height 60rpx
        .singer-name
          font-size 30rpx
          color #888
          line-height 38rpx
</style>
