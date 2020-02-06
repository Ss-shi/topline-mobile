<template>
  <div class="reply-comment">
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon name="cross" slot="left" />
    </van-nav-bar>
    <comment-item :comment="comment" />
    <van-cell title="所有回复" />
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <comment-item  v-for="(comment,index) in list" :key="index" :comment="comment" />
    </van-list>
    <div class="footer">
      <van-button class="write-btn" type="default" round size="small" @click="show=true">写评论</van-button>
      <van-icon
        color="#e5645f"
        name="good-job"
      />
    </div>
    <van-popup v-model="show" position="bottom" :style="{ height: '20%' }">
      <!-- value  @input -->
      <post-comment v-model="postMessage" @click-post='onPost' />
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item'
import { getComments, PostComments } from '@/api/comments'
import PostComment from './post-comment'
export default {
  name: 'replyComment',
  components: {
    CommentItem,
    PostComment
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
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
      limit: 20,
      show: false,
      postMessage: ''
    }
  },
  methods: {
    async onPost () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await PostComments({
          target: this.comment.com_id.toString(),
          content: this.postMessage,
          art_id: this.articleId
        })
        this.postComment = ''
        this.show = false
        this.list.unshift(data.data.new_obj)
        this.comment.reply_count++
        this.$toast.success('发布成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('发布失败')
      }
    },
    async onLoad () {
      const { data } = await getComments({
        type: 'c',
        source: this.comment.com_id.toString(),
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

<style lang='less'>
 .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .write-btn {
      width: 160px;
    }
    .van-icon {
      font-size: 20px;
    }
  }
</style>
