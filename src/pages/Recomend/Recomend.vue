<template>
  <div>
    <scroll-view
      class="main"
      scroll-y="true"
      enable-back-to-top="true"
    >
      <recom-swiper></recom-swiper>
      <personalized></personalized>
      <recom-songs></recom-songs>
      <small-player v-if="curSong.id?true: false"></small-player>
    </scroll-view>
  </div>
</template>

<script>
import RecomSwiper from './components/RecomSwiper'
import Personalized from './components/Personalized'
import RecomSongs from './components/RecomSongs'
import SmallPlayer from '@/components/SmallPlayer'
import { mapState } from 'vuex'
export default {
  name: 'Recomend',
  components: {
    RecomSwiper,
    Personalized,
    RecomSongs,
    SmallPlayer
  },
  computed: {
    ...mapState(['curSong', 'songList'])
  }
}
</script>

<style lang="stylus" scoped>
  .main
    height 1330rpx
</style>
