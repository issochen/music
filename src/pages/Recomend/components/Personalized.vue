<template>
  <div class="personalized">
    <div class="title">推荐歌单</div>
    <div class="content">
      <div
        class="item"
        v-for="(item, index) of personalized"
        :key="index"
        @click="navigate(item.id)"
      >
        <div class="img-wrapper">
          <image
          class="item-img"
          :src="item.picUrl"
          mode="aspectFill"
          lazy-load="true"
          />
          <div class="num">
            <i class="iconfont num-icon">&#xe6a8;</i>
            <span class="num-pri">{{item.playCount}}万</span>
          </div>
        </div>
        <div class="item-desc">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '@/utils/utils'
import { api } from '@/config/config'
export default {
  name: 'Personalized',
  data () {
    return {
      personalized: []
    }
  },
  methods: {
    navigate (id) {
      const url = `../Songs/main?id=${id}`
      wx.navigateTo({ url })
    }
  },
  async mounted () {
    await request(api.personalized).then(res=>{
      let result = res.result.map(item => {
        let playCount = parseInt(item.playCount/10000)
        return (
          {...item, playCount}
        )
      })
      this.personalized = result
    })
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
      .num
        display flex
        position absolute
        right 10rpx
        top 10rpx
        color #fff
        font-size 24rpx
        font-weight bold
        .num-icon
          font-size 24rpx
        .num-pri
          margin-left 10rpx
    .item-desc
      overflow hidden
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
      height 80rpx
      font 28rpx/40rpx '微软雅黑'
</style>