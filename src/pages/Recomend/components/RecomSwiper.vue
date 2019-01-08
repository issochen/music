<template>
  <div class="swiper-wrapper">
    <div class="swiper-bg"></div>
    <swiper
      indicator-dots="true"
      autoplay="true"
      indicator-color="#fff"
      indicator-active-color="#d43c33"
      class="swiper"
    >
      <block v-for="(item, index) in banners" :key="index">
        <swiper-item class="swiper-item" @click="toPlayer(item)">
          <image :src="item.imageUrl" mode="aspectFill"/>
        </swiper-item>
      </block>
    </swiper>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { PLAY, ADD_LIST } from '@/store/mutation-types'
import { request } from '@/utils/utils'
import { api } from '@/config/config'
export default {
  name: 'RecomSwiper',
  data () {
    return {
      banners: []
    }
  },
  computed: {
    ...mapState(['songList'])
  },
  async mounted () {
   await request(api.banner).then(res => {
          this.banners = res.banners
      })
  },
  methods: {
    ...mapMutations([PLAY, ADD_LIST]),
    async toPlayer (i) {
      if (i.targetId === 0 && i.targetType === 3000) {
        wx.showToast({
          title: '这是一则广告',
          icon: 'success',
          duration: 2000
        })
        return
      }
      await request(api.songDetail+i.targetId).then(res => {
        if (res.songs.length === 0) {
          wx.showToast({
            title: '歌曲资源在火星',
            icon: 'success',
            duration: 2000
          })
        } else {
          let picUrl = res.songs[0].al.picUrl,
              al = {picUrl},
              id = res.privileges[0].id,
              name = res.songs[0].al.name,
              ar = res.songs[0].ar;
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
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.swiper-wrapper
  position relative 
  .swiper-bg
    position absolute
    top -10rpx
    width 100%
    height 240rpx
    background #d43c33
  .swiper
    width 90%
    height 300rpx
    margin 10rpx auto 0
    border-radius 20rpx
    overflow hidden
    image
      width 100%
      height 100%
</style>
