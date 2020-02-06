<template>
  <div class="article-collect">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        >
        <van-cell v-for="(item,index) in list" :key="index" :title="item.title"
        @click="$router.push({
          name: 'article',
          params: {
            articleId: item.art_id.toString()
          }
        })"/>
      </van-list>
  </div>
</template>

<script>
import { getUserHistory } from '@/api/user'
export default {
  name: 'articleHistory',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 10
    }
  },
  methods: {
    async onLoad () {
      const { data } = await getUserHistory({
        page: this.page,
        per_page: this.per_page
      })
      const { results } = data.data
      this.list.push(...results)
      // 加载状态结束
      this.loading = false

      // 数据全部加载完成
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style>

</style>
