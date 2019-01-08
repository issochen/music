<template>
  <div class="asider">
    <div
      class="item"
      v-for="(abm, index) of singers"
      :key="index"
      :class='{active: index === flag}'
      @click="scrollTo(index)"
    >
      {{abm.title}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingerAsider',
  props: {
    singers: Array,
    flag: Number
  },
  methods: {
    scrollTo (index) {
      this.flag = index
      this.$emit('index', index)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .asider
    position fixed
    display flex
    flex-direction column
    justify-content space-around
    top 10%
    right 20rpx
    width 30rpx
    height 80%
    .item
      overflow hidden
      width 100%
      height 40rpx
      text-align center
      font 32rpx/40rpx '微软雅黑'
      color #757575
    .active
      color red
</style>