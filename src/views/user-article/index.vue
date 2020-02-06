<template>
  <div class="user-article">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      fixed=""
      />
      <van-tabs v-model="active">
        <van-tab title="收藏">
          <article-collect />
        </van-tab>
        <van-tab title="历史">
          <article-history />
        </van-tab>
        <van-tab title="记录">
          <my-article />
        </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import ArticleCollect from './component/article-collect'
import ArticleHistory from './component/article-history'
import MyArticle from './component/my-article'
export default {
  name: 'userArticle',
  components: {
    ArticleCollect,
    ArticleHistory,
    MyArticle
  },
  props: {
    type: {
      type: String
    }
  },
  data () {
    let active = ['collect', 'history'].indexOf(this.type)
    if (active === -1) {
      active = 2
    }
    return {
      active
    }
  },
  methods: {},
  beforeRouteLeave (to, from, next) {
    console.log(to)
    if (to.name === 'article') {
      this.$store.commit('addCachePage', 'userArticle')
    } else {
      this.$store.commit('delCachePage', 'userArticle')
    }
    next()
  }
}

</script>

<style lang='less'>
.user-article{
  padding-top:90px;
  .van-tabs__wrap{
  position: fixed;
  top: 46px;
  left: 0;
  right:0;
  z-index: 1
 }
}

</style>
