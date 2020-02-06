<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar title="文章详情" left-arrow fixed @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 -->
    <van-loading class="loading" color="#1989fa" vertical v-if="loading">
      <slot>加载中...</slot>
    </van-loading>
    <!-- /加载中 -->

    <!-- 文章详情 -->
    <div class="detail" v-else-if="articleList.title">
      <h3 class="title">{{articleList.title}}</h3>
      <div class="author-wrap">
        <div class="base-info">
          <van-image class="avatar" round fit="cover" :src="articleList.aut_photo" />
          <div class="text">
            <p class="name">{{articleList.aut_name}}</p>
            <p class="time">{{articleList.pubdate}}</p>
          </div>
        </div>
        <van-button
          class="follow-btn"
          v-if="!$store.state.user || articleList.aut_id !== $store.state.user.id"
          :type="articleList.is_followed ? 'primary' : 'info' "
          size="small"
          round
          @click="onFollow"
        >{{articleList.is_followed ? "已关注" : "+ 关注"}}</van-button>
      </div>
      <div class="markdown-body" v-html="articleList.content"></div>
      <article-comment ref='article-comment' :article-id="articleId"  @click-reply='onreply' />
    </div>
    <!-- /文章详情 -->

    <!-- 加载失败提示 -->
    <div class="error" v-else>
      <img src="./no-network.png" alt="no-network" />
      <p class="text">亲，网络不给力哦~</p>
      <van-button class="btn" type="default" size="small" @click="getArticleDetail">点击重试</van-button>
    </div>
    <!-- /加载失败提示 -->

    <!-- 底部区域 -->
    <div class="footer">
      <van-button class="write-btn" type="default" round size="small" @click="show=true">写评论</van-button>
      <van-icon class="comment-icon" name="comment-o" info="9" />
      <van-icon
        color="orange"
        :name="articleList.is_collected ? 'star' : 'star-o'"
        @click="onCollect"
      />
      <van-icon
        color="#e5645f"
        :name="articleList.attitude===1 ? 'good-job' : 'good-job-o'"
        @click="onLike"
      />
      <van-icon class="share-icon" name="share" />
    </div>
    <!-- /底部区域 -->

    <!-- 评论弹层 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '20%' }">
      <!-- value  @input -->
      <post-comment v-model="postComment" @click-post='onPost' />
    </van-popup>

    <!-- 评论回复弹层 -->
    <van-popup v-model="isReplyShow" position="bottom" :style="{ height: '90%' }">
      <!-- value  @input -->
      <reply-comment :comment='currentComment' :article-id='articleId' />
    </van-popup>
  </div>
</template>

<script>
import {
  getArticleById,
  addCollect,
  deleteCollect,
  addLike,
  deleteLike
} from '@/api/article'
import { addFollow, deleteFollow } from '@/api/user'
import ArticleComment from './component/article-comment'
import PostComment from './component/post-comment'
import ReplyComment from './component/reply-comment'
import { PostComments } from '@/api/comments'
export default {
  name: 'ArticlePage',
  components: {
    ArticleComment,
    PostComment,
    ReplyComment
  },
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      articleList: {},
      loading: true,
      show: false,
      postComment: '',
      isReplyShow: false,
      currentComment: {}
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getArticleDetail()
  },
  mounted () {},
  methods: {
    onreply (comment) {
      this.currentComment = comment
      this.isReplyShow = true
    },
    // 发布评论
    async onPost () {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await PostComments({
          target: this.articleId,
          content: this.postComment
        })
        this.postComment = ''
        this.show = false
        this.$refs['article-comment'].list.unshift(data.data.new_obj)
        this.$toast.success('发布成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('发布失败')
      }
    },
    async getArticleDetail () {
      this.loading = true
      const { data } = await getArticleById(this.articleId)
      //   console.log(data)
      this.articleList = data.data
      this.loading = false
    },
    async onLike () {
      if (this.articleList.attitude === 1) {
        await deleteLike(this.articleId)
        this.articleList.attitude = -1
        this.$toast.success('取消点赞')
      } else {
        await addLike(this.articleId)
        this.articleList.attitude = 1
        this.$toast.success('点赞成功')
      }
    },
    async onCollect () {
      if (this.articleList.is_collected) {
        await deleteCollect(this.articleId)
        this.articleList.is_collected = false
        this.$toast.success('取消收藏')
      } else {
        await addCollect(this.articleId)
        this.articleList.is_collected = true
        this.$toast.success('收藏成功')
      }
    },
    async onFollow () {
      if (this.articleList.is_followed) {
        await deleteFollow(this.articleList.aut_id)
        this.articleList.is_followed = false
      } else {
        await addFollow(this.articleList.aut_id)
        this.articleList.is_followed = true
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  padding: 46px 20px 50px;
  background: #fff;
  .loading {
    padding-top: 100px;
    text-align: center;
  }
  .detail {
    .title {
      margin: 0;
      padding-top: 24px;
      font-size: 20px;
      color: #3a3a3a;
    }
    .author-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      height: 40px;
      .base-info {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          margin-right: 8px;
        }
        .text {
          line-height: 1.5;
          .name {
            margin: 0;
            font-size: 14px;
          }
          .time {
            margin: 0;
            font-size: 12px;
            color: #999;
          }
        }
      }
      .follow-btn {
        width: 85px;
      }
    }
  }
  .error {
    padding-top: 100px;
    text-align: center;
    .text {
      font-size: 15px;
    }
    .btn {
      width: 30%;
    }
  }
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
    .comment-icon {
      bottom: -2px;
    }
    .share-icon {
      bottom: -2px;
    }
  }
}
</style>
