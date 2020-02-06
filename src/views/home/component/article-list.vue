<template>
  <div class="article-container">
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- 上拉加载 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="(item,index) in list" :key="index" :title="item.title" @click="$router.push('/article/'+item.art_id)"/>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getChannelArticleList } from '@/api/article'
export default {
  name: 'articltListPage',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      isLoading: false
    }
  },
  methods: {
    async onRefresh () {
      const { data } = await getChannelArticleList({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      const { results } = data.data
      this.list.unshift(...results)
      this.isLoading = false
      this.$toast(`更新了${results.length}条数据`)
    },
    // 获取文章列表
    async onLoad () {
      const { data } = await getChannelArticleList({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(),
        with_top: 1
      })
      const { results } = data.data
      this.list.push(...results)
      // 加载状态结束
      this.loading = false

      // 数据全部加载完成
      if (results.length) {
        this.timestamp = data.data.pre_timestamp
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style>
</style>
