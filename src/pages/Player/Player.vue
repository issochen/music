<template>
  <div
    class="main"
    :style="{backgroundImage:ImgUrl}"
  > 
    <div class="cover">{{curSong.ar? curSong.ar[0].name : '' }}</div>
    <div
      class="disc"
      :style="{animationPlayState: audio.animation}"
      v-if="!isShow"
    >
      <div
        class="disc-img"
        :style="{backgroundImage:ImgUrl}"
        @click="showLyric"
      >
      </div>
    </div>
    <div
      class="lyric"
      v-if='isShow'
      @click="showLyric"
    >
      <div
        class="lyric-wrapper"
        :style="{transform}"
      >
        <div
          v-if="lyric.lines.length > 0"
          class="lyric-line"
          v-for="(item, index) of lyric.lines"
          :key="index"
          :class="{cur:index==curLine}"
        >
          {{item.txt}}
        </div>
        <div v-if="lyric.lines.length === 0" class="none">暂无歌词</div>
      </div>
    </div>

    <!-- 播放页面 进度条 -->
    <div class="progress">
      <div class="curTime">{{curTime}}</div>
      <progress
        :percent="percent"
        border-radius="20px"
        color="#d43c33"
        backgroundColor="#757575"
        class="progress-bar"
        active="true"
        active-mode="forwards"
        @click="toTime"
      >
         <!-- 进度条上的小球 -->
        <div
          class="circle"
          :style="{left: percent+'%'}"
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend"
        >
          <div class="ball"></div>
        </div>
      </progress>
      <div class="totalTime">{{totalTime}}</div>
    </div>
    <!-- 播放页面 按钮组 -->
    <div class="player-btn">
      <i class="item" @click="changeState">
        <i class="iconfont item" v-show="playState === 0">&#xe66c;</i>
        <i class="iconfont item" v-show="playState === 1">&#xe622;</i>
        <i class="iconfont item" v-show="playState === 2">&#xe66d;</i>
      </i>
      <i class="iconfont item" @click="preSong">&#xe61f;</i>
      <i class=" item" @click="stop">
        <i class="iconfont item" v-if="audio.flag">&#xe6ca;</i>
        <i class="iconfont item" v-else >&#xe696;</i>
      </i>
      <i class="iconfont item" @click="nextSong">&#xe624;</i>
      <i class="iconfont item" @click="showSonglist">&#xe649;</i>
    </div>
    <song-list
      :songlistFlag="songlistFlag"
      :songlistTrans="songlistTrans"
      @close="showSonglist"
    ></song-list>
  </div>
</template>

<script>
import SongList from '@/components/SongList'
import { mapState, mapMutations } from 'vuex'
import { PLAY, AUDIO } from '@/store/mutation-types'
import { getOptions, request, playSong } from '@/utils/utils'
import { api } from '@/config/config'
import Lyric from 'lyric-parser'
export default {
  name: 'Player',
  components: {
    SongList
  },
  data () {
    return {
      songlistFlag: false,
      songlistTrans: 'translateY(680rpx)', // 当前歌单列表 的位置
      transform: 'translateY(480rpx)', // 歌词滚动位置
      isShow: false, // true 显示歌词 false 不显示
      animation: 'running',  
      ImgUrl: '',  //  当前 播放歌曲 的 disc  背景图片
      percent:'', //播放进度条 百分比
      songUrl: '',  //当前 播放歌曲 的 url 链接
      lyric: null,   //当前 播放歌曲的 歌词
      totalTime: '', //当前播放歌曲 的 总时间
      curTime: '',  // 当前 播放歌曲 的 当前 播放时间
      curLine: '',  //当前播放歌曲 播放到哪一句 歌词
      playState: 0, // 列表 播放 模式  0 为 循环播放  1 为 随机 播放  2 为 单曲 循环
      rect: '', // 屏幕 总宽度
      startPercent: '',  // 开始 的百分比
      endPercent: '', // 松开的 百分比
      moveState: false  // 判断 是否正在拖动 进度条
    }
  },
  watch: {
    curSong (newSong, oldSong) {   //监听 当前 歌曲 的变化信息 
      if (this.playState !== 2) {
        if (newSong.id === oldSong.id) {  // 如果 点 同一首 歌曲  直接 返回
          return
        }
      }
       if (this.lyric) {   //判断 这首歌 是否 有歌词
        this.lyric.stop? this.lyric.stop() : null
      }
      
      this.$nextTick(()=>{   //  如果 满足 以上 条件  执行 下面 
        if( this.audio ) {
          if (this.audio.AudioContext != null ) {  // 如果 微信小程序 audio 对象 不为空
            this.audio.AudioContext.destroy()   //则销毁 上一首 歌曲 实例
          }
        } 
        if (!newSong.id) { // 如果当前歌曲 信息不存在
          let title = '当前无音乐正在播放'
          wx.setNavigationBarTitle({ title })
          this.lyric = {lines: []}
          this.ImgUrl = ''
          let v = {...this.audio, flag: false}
          this[AUDIO] (v)
          return
        }

        let title = `歌名:${this.curSong.name}`
        wx.setNavigationBarTitle({ title })
        this.ImgUrl = `url(${this.curSong.al.picUrl})`
        const AudioContext = wx.createInnerAudioContext()
        let v = {AudioContext , flag: true, animation: 'running'}
        this[AUDIO] (v)
        this.isShow = false
        this.getSong ()
      })
    }

  },
  methods: {
    ...mapMutations([
      PLAY, AUDIO
    ]),
    //拖动进度条 事件
    touchstart (e) {
      this.moveState = true  // 改状态 为拖动进度条状态 
      let startX = e.clientX - 60// 获取 手指 按下去的 坐标 
      this.startPercent = (startX / this.rect) * 100
    },
    touchend (e) {
      // 根据 endPercent  百分比 以及 歌曲 总时间长  计算出 拖动到的 位置 
      let toTime = this.audio.AudioContext.duration * this.endPercent / 100 
      this.audio.AudioContext.seek(toTime)
      this.moveState = false   // 改状态  为 随 播放时间 而动 状态 
    },
    touchmove (e) {
      let moveX = e.clientX - 60
      let movePercent = (moveX / this.rect) *100
      this.percent = movePercent
      this.endPercent = movePercent
    },
    //点击 进度条 改变 播放时间 
    toTime (e) {
      let clickX = e.clientX - 60
      let toPercent = (clickX / this.rect )
      let toTime = this.audio.AudioContext.duration * toPercent 
      this.audio.AudioContext.seek(toTime)
    },

    changeState () {  //切换 循环 模式
      let _this = this
      wx.showActionSheet({
        itemList: ['循环播放', '随机播放', '单曲循环'],
        success(res) {
          _this.playState = res.tapIndex
          let title = ''
          if (res.tapIndex === 0) {
            title = '循环播放哦'
          } else if (res.tapIndex === 1) {
            title = '随机播放！！！'
          } else if (res.tapIndex === 2) {
            title = '最爱单曲循环'
          }
          wx.showToast({
            title,
            icon: 'success',
            duration: 1000
          })
        }
      })
    },
    preSong () {
       let cur_id = this.curSong.id
      //获取 当前 的播放列表
      let list = this.songList
      let i = null // 记录 将要 播放的 歌曲在 播放列表的 位置
      list.forEach((item, index) => {
        if (item.id === cur_id) {
          if (index === 0) {  //如果当前播放歌曲 为列表 第一首  
            i = list.length - 1   // 直接 切换到 列表 最后一首
            return 
          }
          i = index - 1
        }
      })
      //切换
      this[PLAY](list[i])
      wx.showToast({
        title: `当前播放歌曲为${this.curSong.name}`,
        icon: 'success',
        duration: 2000
      })
    },
    nextSong () {
      //获取 当前播放歌曲的id
      let cur_id = this.curSong.id
      //获取 当前 的播放列表
      let list = this.songList
      let i = null // 记录 将要 播放的 歌曲在 播放列表的 位置
      list.forEach((item, index) => {
        if (item.id === cur_id) {
          if (index === list.length - 1) { // 如果 当前播放歌曲 为 列表 最后一首
            i = 0     // 直接切换到 列表 第一首歌曲
            return 
          }
          i = index + 1
        }
      })
      //切换
      this[PLAY](list[i])
      wx.showToast({
        title: `当前播放歌曲为${this.curSong.name}`,
        icon: 'success',
        duration: 2000
      })
    },
    stop () {   //停止 播放 
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
    showLyric () {  // 点击 背景图 切换 是否显示歌词 
      this.isShow = !this.isShow
    },
    showSonglist (v) {   // 点击 详情 显示 当前 播放列表
      this.songlistFlag = !this.songlistFlag
      if (v === 1) {
        this.songlistTrans = 'translateY(680rpx)'
      } else {
        this.songlistTrans = 'translateY(0rpx)'
      }  
    },
    async getSong () {   //  异步方法  获取当前 播放歌曲 的  url  和  歌词 详细信息 
      await request(api.songUrl+this.curSong.id).then(res=>{
        this.songUrl = res.data[0].url
      })
      await request(api.lyric+this.curSong.id).then(res=>{
        this.lyric = new Lyric(res.lrc.lyric)
      })
      playSong.call(this, this.songUrl, this.lyric.lines, this[PLAY])   // 调用工具函数 
     
    }
  },
  computed: {
    ...mapState([ 'songList', 'curSong', 'audio' ])
  },
  mounted () {
    //将 屏幕 总宽度 保存在 data 里
    this.rect = wx.getSystemInfoSync().windowWidth - 120
    // console.log(this.songList) // 当前播放 列表 信息
    // console.log(this.curSong)  //当前播放 歌曲 信息
    if (this.curSong.id ) {
      let title = `歌名:${this.curSong.name}`
      wx.setNavigationBarTitle({ title })
      this.ImgUrl = `url(${this.curSong.al.picUrl})`
      this.getSong ()
     }
  }
}
</script>

<style scoped>
.none{
  color:#fff;
  font-size: 60rpx;
}
.main{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.main>.cover{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color:#fff;
  text-align: center;
  background: rgba(0,0,0,.9);
} 
.main>.disc{
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 580rpx;
  height: 580rpx;
  border-radius: 50%;
  top: 180rpx;
  left: 50%;
  margin-left: -290rpx;
  background: #d43c33;
  animation: myrotate 20s linear infinite ;
}
.disc > .disc-img{
  width: 90%;
  height: 90%;
  border-radius: 50%;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.lyric{
  position:absolute;
  overflow:hidden;
  top: 60rpx;
  bottom: 290rpx;
  width: 100%;
  font: 30rpx/40rpx '微软雅黑';
  text-align: center;
}
.lyric>.lyric-wrapper{
  width: 100%;
  height: 100%;
  transition: all .5s
}
.lyric-wrapper> .lyric-line{
  color:#e4e4e4;
  margin-bottom: 40rpx
}
.lyric-wrapper> .cur{
  color:#d43c33;
}
.progress{
  display:flex;
  position: absolute;
  bottom: 200rpx;
  left: 0;
  right: 0;
  color:#fff;
  margin-bottom: 20rpx;
}
.progress>.curTime, .progress>.totalTime{
  flex:1;
  font-size:30rpx;
  text-align:center;
}
.progress>.progress-bar{
  position:relative;
  width: 520rpx;
  margin-left: 20rpx;
  margin-right: 20rpx;
}

.progress-bar .circle{
  position:absolute;
  top:50%;
  margin-top: -15rpx;
  /* left: -15rpx; */
  display:flex;
  justify-content: center;
  align-items: center;
  width: 30rpx;
  height:30rpx;
  border-radius: 50%;
  background: #fff;
}
.progress-bar .circle .ball{
  width:10rpx;
  height:10rpx;
  border-radius: 50%;
  background: #d43c33;
}

.player-btn{
  position:absolute;
  display:flex;
  padding: 0 40rpx;
  align-items:center;
  justify-content:space-between;
  left: 0;
  right: 0;
  bottom:100rpx;
  color:#fff;
}
.player-btn .item{
  text-align:center;
  font-size:55rpx;
  flex:1;
}
.player-btn>.item:nth-child(3)>.item{
  font-size:90rpx;
}




@keyframes myrotate
{
  0% {transform: rotate(0)}
  100% {transform: rotate(360deg)}
}
</style>