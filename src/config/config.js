// export const host = "http://120.79.208.19:3000"  
// export const host = "http://localhost:5757/weapp"
// export const host = "https://6zmvxuoa.qcloud.la/weapp"
export const host = "http://localhost:3000"

export const api = {
  banner: '/banner', //轮播图api
  personalized: '/personalized', //推荐 歌单api
  newsong: '/personalized/newsong', //推荐歌曲 api
  topListDetail: '/toplist/detail', //排行榜单 详情 api
  playList: '/playlist/detail?id=',  // 获取歌单详情api
  singers: '/toplist/artist', //歌手榜  api
  songDetail: '/song/detail?ids=',  //歌曲详情
  songUrl: '/song/url?id=',  //歌曲 url 地址 
  lyric: '/lyric?id=' , //获取 歌词 api
  artist: '/artists?id=',  //获取 歌手专辑 api
  search: '/search?keywords=',  // 搜索 歌手  歌曲 api
  hotSearch: '/search/hot'  // 获取 热 搜 的 内容
}