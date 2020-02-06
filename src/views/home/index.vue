<template>
  <div class="home-container">
    <van-nav-bar title="首页" fixed></van-nav-bar>
    <van-tabs v-model="active">
      <van-icon name="wap-nav" slot="nav-right" @click="show=true" />

      <van-tab v-for="channel in channelList" :title="channel.name" :key="channel.id">
        <article-list :channel="channel"></article-list>
      </van-tab>
    </van-tabs>

    <!-- 弹出层 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '90%' }" closeable round>
      <channel-edit :user-channels="channelList" @switch="switchPupup" :active="active"></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { userChannels } from '@/api/channels'
import ArticleList from './component/article-list'
import ChannelEdit from './component/channel-edit'
import { getItem } from '@/utils/storage'
export default {
  name: 'homePage',
  data () {
    return {
      channelList: [],
      show: false,
      active: 0
    }
  },
  components: { ArticleList, ChannelEdit },
  methods: {
    // 获取频道列表
    async getUserChannels () {
      try {
        let channels = []
        const localUserChannels = getItem('user-channel')
        if (localUserChannels) {
          channels = localUserChannels
        } else {
          const { data } = await userChannels()
          channels = data.data.channels
        }
        this.channelList = channels
      } catch (error) {
        console.log(error)
        this.$toast('频道列表获取失败')
      }
    },
    switchPupup (index) {
      this.active = index
      this.show = false
    }
  },
  created () {
    this.getUserChannels()
  }
}
</script>

<style lang='less' scoped>
.home-container {
  padding-top: 90px;
  padding-bottom: 50px;
}
/deep/ .van-tabs__wrap {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  z-index: 1;
}
.van-icon {
  position: fixed;
  right: 0px;
  line-height: 44px;
  background-color: #fff;
  font-size: 20px;
  padding-right: 5px;
}
</style>
