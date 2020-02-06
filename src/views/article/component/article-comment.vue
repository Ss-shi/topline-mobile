<template>
  <div class="article-comment">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="loadComments">
      <comment-item
      :comment='item'
      v-for="(item,index) in list"
      :key="index"
      :title="item.content"
      @click-reply="$emit('click-reply', $event)"/>
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comments'
import CommentItem from './comment-item'
export default {
  name: 'articleComment',
  components: {
    CommentItem
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 20
    }
  },
  methods: {
    async loadComments () {
      const { data } = await getComments({
        type: 'a',
        source: this.articleId,
        offset: this.offset,
        limit: this.limit
      })

      const { results } = data.data
      this.list.push(...results)

      this.loading = false

      if (results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style>
</style>
