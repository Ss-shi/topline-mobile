<template>
  <div class="my-container">
    <!-- 已登录 -->
    <div class="my-login" v-if="$store.state.user">
      <van-row type="flex" align="center">
        <van-col span="6" offset="1" @click='$router.push("/user/" + user.id)'>
          <van-image round width="2rem" height="2rem" :src="user.photo" />
        </van-col>
        <van-col span="9" @click='$router.push("/user/" + user.id)'>
          <span class="name">{{user.name}}</span>
        </van-col>
        <van-col span="7" offset="1">
          <van-button type="default" round @click="$router.push('/user/profile')">编辑资料</van-button>
        </van-col>
      </van-row>
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
    </div>

    <!-- 未登录 -->
    <div class="my-unlogin" v-else @click="$router.push('/login')">
      <img src="./mobile.png" alt />
      <div>点击登录</div>
    </div>

    <!-- 收藏 -->
    <div class="collect">
      <van-grid :column-num="3">
        <van-grid-item icon="star-o" text="我的收藏" to="/my-article/collect"/>
        <van-grid-item icon="browsing-history-o" text="浏览历史" to="/my-article/history" />
        <van-grid-item icon="edit" text="作品" to="/my-article" />
      </van-grid>
    </div>

    <div style="margin-top: 10px;">
      <van-cell-group>
        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学" is-link />
      </van-cell-group>
    </div>
    <van-cell-group style="margin-top: 10px;">
      <van-cell
        title="退出登录"
        style="text-align:center"
        v-if="$store.state.user"
        clickable
        @click="outLogin"
      />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
export default {
  data () {
    return {
      user: {}
    }
  },
  methods: {
    // 退出登录
    async outLogin () {
      await this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出登录吗'
      })
      this.$store.commit('onSetItem', null)
    },
    // 登录页面
    async getInfo () {
      try {
        const { data } = await getUserInfo()
        this.user = data.data
      } catch (error) {
        this.$toast('获取数据失败')
      }
    }
  },
  created () {
    if (this.$store.state.user) { this.getInfo() }
  }
}
</script>

<style lang='less' scoped>
.my-container {
  font-size: 14px;
  .my-unlogin {
    background-image: url("./banner.png");
    width: 100%;
    text-align: center;
    color: #fff;
    padding: 40px 0;
    img {
      width: 70px;
      margin-bottom: 10px;
    }
  }
  .my-login {
    background-image: url("./banner.png");
    width: 100%;
    .van-row {
      padding-top: 30px;
      .name {
        color: #fff;
      }
    }
    ::v-deep .van-grid-item__content {
      background: none !important;
      color: #fff;
    }
  }
}
</style>
