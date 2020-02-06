<template>
  <div class="user-container">
    <div class="top-user">
      <van-nav-bar :title="user.name" left-arrow @click-left="$router.back()" style="color:#fff;" />
      <van-row type="flex" align="center">
        <van-col span="6" offset="1">
          <van-image round width="2rem" height="2rem" :src="user.photo" />
        </van-col>
        <van-col span="17">
          <van-grid :border="false">
            <van-grid-item>
              <span>{{user.art_count}}</span>
              <span>头条</span>
            </van-grid-item>
            <van-grid-item>
              <span>{{user.follow_count}}</span>
              <span>关注</span>
            </van-grid-item>
            <van-grid-item>
              <span>{{user.fans_count}}</span>
              <span>粉丝</span>
            </van-grid-item>
            <van-grid-item>
              <span>{{user.like_count}}</span>
              <span>获赞</span>
            </van-grid-item>
          </van-grid>
          <van-row>
            <van-col span="12">
              <van-button type="primary" style="width:100px;">私信</van-button>
            </van-col>
            <van-col span="12">
              <van-button type="info" style="width:100px;">+关注</van-button>
            </van-col>
          </van-row>
        </van-col>
      </van-row>
      <van-row>
        <van-col offset="2">
          <span>简介:</span>
          <span>{{ user.intro }}</span>
        </van-col>
      </van-row>
    </div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item,index) in list" :key="index" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getUserById } from '@/api/user'
import { getArticleList } from '@/api/article'

export default {
  name: 'userPage',
  data () {
    return {
      user: {},
      loading: false,
      finished: false,
      list: [],
      page: 1
    }
  },
  methods: {
    async onLoad () {
      // 获取数据
      const { data } = await getArticleList(this.$route.params.userId, {
        page: this.page,
        per_page: 20
      })
      // 数据放入列表
      const { results } = data.data
      console.log(data)

      this.list.push(...results)
      // 加载状态结束
      this.loading = false
      // 数据全部加载完成
      if (results.length) {
        this.page++
      }
      this.finished = true
      // 异步更新数据
      //   setTimeout(() => {
      //     for (let i = 0; i < 10; i++) {
      //       this.list.push(this.list.length + 1)
      //     }
      //     // 加载状态结束
      //     this.loading = false

    //     // 数据全部加载完成
    //     if (this.list.length >= 40) {
    //       this.finished = true
    //     }
    //   }, 500)
    },

    async getUser () {
      const { data } = await getUserById(this.$route.params.userId)
      this.user = data.data
    }
  },
  created () {
    this.getUser()
  }
}
</script>

<style lang='less' scoped>
.user-container {
  font-size: 14px;
  .top-user {
    background-color: #fff;
  }
}
</style>
