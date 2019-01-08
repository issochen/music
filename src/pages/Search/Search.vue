<template>
  <div class="main">
    <div class="search-wrapper">
      <input
        class="search-input"
        type="text"
        placeholder="请输入歌手或歌曲关键字"
        v-model="keywords"
        @input="exchange"
      >
    </div>
    <div class="hot-search" v-if="!showResult">
      <div class="hot-title">热门搜索</div>
      <div class='item-wrapper'>
        <div
          class="hot-item"
          v-for="(item ,index) of hotSearch"
          :key="index"
          @click="search(item.first)"
        >
          {{item.first}}
        </div>
      </div>
    </div>
    <search-result
      v-else
      :results="results"
      :singer="singer"
      :playLists="playLists"
    >
    </search-result>
  </div>
</template>

<script>
import SearchResult from './components/SearchResult'
import search from '@/utils/search'
import { request } from '@/utils/utils'
import { api } from '@/config/config'
export default {
  name: 'Search',
  components: {
    SearchResult
  },
  data () {
    return {
      hotSearch: '',
      keywords: '',
      timer: null,
      results: '',
      singer: '',
      playLists: '',
      showResult: false,
      refreshNum: 0
    }
  },
  async mounted () {
    await request(api.hotSearch).then(res => {
      this.hotSearch = res.result.hots
    })
  },
  async onReachBottom() {
    this.refreshNum ++
    let offset = this.refreshNum * 15
    await request(api.search+this.keywords+'&limit=15&offset='+offset).then(res => {
      if (!res.result.songs) {
        wx.showModal({
          title: '提示',
          content: '抱歉，资源库没有更多资源了'
        })
        return
      }
      this.results = [...this.results, ...res.result.songs]
    })
  },
  methods: {
    async search (key) {
      this.showResult = true
      this.keywords = key
      await search.call(this, key)
    },
    exchange (v) {
      if (this.timer) {
          clearTimeout(this.timer)
        }
      if (v.target.value !== '') {
        this.showResult = true
        this.timer = setTimeout(async () => {
          await search.call(this, v.target.value)
        }, 300)
      } else {
        this.showResult = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.main
  padding-top 200rpx
  box-sizing border-box
  .search-wrapper
    position fixed
    top 0
    width 100%
    display flex
    justify-content center
    align-items center
    height 200rpx
    background #fff
    box-shadow 0 2px 2px 2px #ccc
    .search-input
      width 500rpx
      height 60rpx
      border 2rpx solid #ccc
      border-radius 10rpx
      text-indent 2em
      font-size 30rpx
  
  .hot-search
    padding 0 50rpx
    color #757575
    .hot-title
      font-size 36rpx
    .item-wrapper
      display flex
      justify-content space-between
      flex-wrap wrap
      .hot-item
        width 200rpx
        height 80rpx
        line-height 80rpx
        font-size 30rpx
        text-align center
        border-radius 20rpx
        color #fff
        background #d43c33
        margin-bottom 10rpx
</style>