<template>
	<div>
		<div class="singer">
			歌手&歌单
		</div>
		<div class="singer-item" @click="navigate(singer.id, 0)">
			<img class="singer-img" :src="singer.picUrl?singer.picUrl: null" alt="">
			<div class="singerName one-txt-cut">
				歌手：{{singer.name?singer.name:'暂无匹配到的歌手'}}
			</div>
		</div>
		<div class="singer-item" @click="navigate(playLists.id, 1)">
			<img class="singer-img" :src="playLists.coverImgUrl?playLists.coverImgUrl:null" alt="">
			<div class="singerName one-txt-cut">
				歌单：{{playLists.name?playLists.name:'暂无匹配到的歌单'}}
			</div>
		</div>
		<div class="singer">
			歌曲
		</div>
		<div
			v-if="results"
			class="song-item"
			v-for="(item, index) of results"
			:key="index"
		>	
			<div @click="toPlayer(item)">
				<div class="song-name one-txt-cut">{{item.name}}</div>
				<div class="singer-name one-txt-cut">
					<span v-for="(v, i) of item.artists" :key="i">
						{{v.name}}<span v-if="item.artists[i+1]">-</span>
					</span>
				</div>
			</div>
		</div>
		<div v-if="!results" class="no-results">
			暂无匹配的 歌曲
		</div>
	</div>
</template>

<script>
import { PLAY, ADD_LIST } from '@/store/mutation-types'
import { mapState, mapMutations } from 'vuex'
export default {
	name: 'SearchResult',
	props: {
		results: { type: Array, default: null },
		singer: { type: Object, default: null },
		playLists: { type: Object, default: null }
	},
	computed: {
		...mapState(['songList'])
	},
	methods: {
		...mapMutations([PLAY,ADD_LIST]),
		navigate (id, n) {
			let url =' '
			if (n === 0) {
				url = `../Songs/main?id=${id}&flag=singer`
			} else if (n === 1) {
				url = `../Songs/main?id=${id}`
			}
			wx.navigateTo({ url })	
		},
		toPlayer (i) {
			let picUrl = i.artists[0].picUrl,
          al = {picUrl},
          id = i.id,
          name = i.name,
					ar = i.artists;
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
	}
}
</script>

<style lang="stylus" scoped>
	.singer
		font-size 30rpx
		line-height 60rpx
		color #d43c33
		padding 0 40rpx
	.singer-item
		display flex
		align-items center
		height 134rpx
		padding 16rpx 40rpx
		box-sizing border-box
		border-bottom 2rpx solid #e4e4e4
		.singer-img
			width 100rpx
			height 100rpx
		.singerName
			flex 1
			font-size 34rpx
			margin-left 20rpx
	.song-item
		height 114rpx
		padding 16rpx 40rpx
		border-bottom 2rpx solid #e4e4e4
		.song-name
			height 64rpx
			font-size 34rpx
			line-height 64rpx
		.singer-name
			height 50rpx
			font-size 26rpx
			line-height 50rpx
			color #757575
	.no-results
		line-height 300rpx
		text-align center
		color #d43c33
</style>


