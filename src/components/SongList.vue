<template>
  <div>
    <!-- 当前歌单列表 的 歌曲  -->
    <div class="songlist-wrapper" v-show="songlistFlag" @click="closeList"></div>
    <div class="songlist" :style='{transform: songlistTrans}'>
      <div class="songlist-head">
        <div><i class="iconfont order-icon">&#xe66c;</i>顺序播放({{songList.length}})</div>
        <div @click="clearList"><i class="iconfont clear-icon">&#xe63c;</i></div>
      </div>
      <scroll-view class="list" scroll-y="true">
        <div v-for="(item, index) of songList" :key="index" class="list-item">
          <div @click="changeSong(item)"><i class="iconfont item" v-show="item.id === curSong.id">&#xe753;</i>{{item.name}}</div>
          <div @click="removeItem(item.id)"><i class="iconfont item">&#xe7ac;</i></div>
        </div>
      </scroll-view>
      <div class="list-close" @click="closeList"><i class="iconfont close-icon">&#xe60e;</i></div>
    </div>
  </div>
</template>


<script>
import { mapState, mapMutations } from 'vuex'
import { REMOVE_LIST_ITEM, PLAY, CLEAR_LIST } from '@/store/mutation-types'
export default {
  name: 'SongList',
  props: ['songlistFlag', 'songlistTrans'],
  computed: {
    ...mapState(['curSong', 'songList'])
  },
  methods: {
    ...mapMutations([
      REMOVE_LIST_ITEM, PLAY, CLEAR_LIST
    ]),
    closeList () {
      this.$emit('close', 1)
    },
    clearList () {
      let _this = this
      wx.showModal({
        title: '提示',
        content: '您要删除播放列表， 删除后将跳转页面！！！',
        success (res) {
          if (res.confirm) {
            _this[CLEAR_LIST] ()
            _this[PLAY] ({})
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    },
    removeItem (id) {
      if (id === this.curSong.id) {
        let _this = this
        wx.showModal({
          title: '提示',
          content: '您要删除当前播放音乐，删除后将停止播放！！！',
          success (res) {
            if (res.confirm) {
              _this[REMOVE_LIST_ITEM] (id)
              _this[PLAY] ({})
            }
          }
        })
      } else {
        this[REMOVE_LIST_ITEM] (id)
      }
    },
    changeSong (item) {
      this[PLAY] (item)
    }
  }
}
</script>

<style scoped>
.songlist-wrapper{
  position:absolute;
  top:0;
  bottom:680rpx;
  width:100%;
  background: rgba(0,0,0, .8);
  z-index: 999;
}
.songlist{
  position:absolute;
  bottom:0;
  width:100%;
  background:#f2f3f4;
  height: 680rpx;
  border-radius: 20rpx 20rpx 0 0;
  z-index: 999;
  transform-origin: 100% 100%;
  transition: all .5s
}
.songlist>.songlist-head{
  overflow:hidden;
  height:100rpx;
  line-height:100rpx;
  font-size: 30rpx;
  padding: 0 40rpx 0;
}
.songlist-head>div{
  display:flex;
  float:left
}
.songlist-head>div:first-child{
  width:95%;
}
.songlist-head>div+div{
  width:5%;
}
.songlist-head .order-icon{
  margin-right: 20rpx;
}
.songlist-head .order-icon,.songlist-head .clear-icon{
  font-size: 40rpx
}
.list-close{
  display:flex;
  justify-content:center;
  align-items:center;
  height:100rpx;
}
.list-close>.close-icon{
  font-size: 50rpx;
}
.list{
  height:480rpx;
}
.list .list-item{
  overflow:hidden;
  padding: 0 40rpx 0;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
}
.list-item>div{
  float:left
}
.list-item>div:first-child{
  display:flex;
  width:95%
}
.list-item>div:first-child> .item{
  margin-right: 10rpx;
}
.list-item>div+div{
  width:5%
}
.list-item .item{
  font-size: 40rpx;
  color: #d43c33
}
</style>