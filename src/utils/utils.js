
import { host } from '../config/config'
export function request (url,method = 'GET', data) {
  wx.showLoading({
    title: '陈大大正在拉取数据'
  })
  return new Promise( (resolve, reject) => {
    wx.request({
      url: `${host}${url}`,
      data,
      method,
      success (res) {
        wx.hideLoading({})
        if (res.statusCode === 200 && res.data.code === 200) {
          resolve(res.data)
        }
      },
      fail (res) {
        reject(res)
      }
    })
  })
}


export function getOptions() {
  let pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  return currentPage.options
   
}

function totalTime(t){
  let time = ''
  let min = parseInt(t/60) < 10? '0'+parseInt(t/60): parseInt(t/60)
  let sec = parseInt(t%60) <10 ? '0' +parseInt(t%60): parseInt(t%60)
  time = min + ':' + sec
  return time
}


export function playSong(src, lyric, PLAY) {
    this.audio.AudioContext.autoplay = true
    this.audio.AudioContext.src = src
    setTimeout(()=>{
      this.totalTime = totalTime(this.audio.AudioContext.duration)
    },1000)

    this.audio.AudioContext.onPlay(() => {
      console.log('开始播放')
    })
    this.audio.AudioContext.onTimeUpdate( () =>{
      this.curTime= totalTime(this.audio.AudioContext.currentTime)
      if (!this.moveState) {
        this.percent = parseInt((this.audio.AudioContext.currentTime /  this.audio.AudioContext.duration)*100)
      }
      let current = parseInt(this.audio.AudioContext.currentTime*1000)
      for (let i = 0; i < lyric.length - 1; i++) {
        if ((current > lyric[i].time)&&(current < lyric[i+1].time)) {
             //播放时间大于对应歌词时间小于下一句歌词时间就显示当前歌词
            this.curLine = i
            if (i == lyric.length -2 ) {
              this.curLine = lyric.length - 1
            }
            let x = null
            x = 480 - i*80
            if ( i == lyric.length - 6) {
              x = 480 - (lyric.length - 6)*80
            }
            this.transform = `translateY(${x}rpx)`
            break;//找到对应歌词就停，不停的话，呵呵。。。
        }
      }
    })
    this.audio.AudioContext.onEnded(() => {
      //判断 当前 播放 模式 
      switch (this.playState) {
        case 0: //循环播放
          this.nextSong()  // 调用播放下一首 方法
        break;
        case 1:  // 随机播放
          let random = Math.floor(Math.random() * this.songList.length)   // 生成 随机数
          let song = this.songList[random]
          PLAY (song)
        break;
        case 2:  //单曲循环
          let ran = Math.random() * 1000
          let son = {...this.curSong, ran}
          PLAY (son)
        break;
      }
    })
}