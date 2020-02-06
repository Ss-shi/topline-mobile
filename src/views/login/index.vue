<template>
  <div class="login-container">

    <van-nav-bar title="注册/登录" left-arrow
      @click-left="$router.back()"/>

    <ValidationObserver ref="form">
    <!-- <van-field clearable placeholder="请输入手机号" v-model="user.mobile" class="icon icon-mobile"> -->
      <ValidationProvider name='手机号' rules='required|mobile' immediate>
        <van-field clearable placeholder="请输入手机号" v-model="user.mobile" >
        <i class="icon icon-mobile" slot='left-icon'></i>
        <!-- <van-icon class-prefix="icon" name="icon-mobile" /> -->
        </van-field>
        <!-- <span>{{ errors[0] }}</span> -->
      </ValidationProvider>

      <ValidationProvider name='验证码' rules='required|code' immediate>
        <van-field placeholder="请输入验证码" v-model="user.code">
          <i class="icon icon-lock" slot='left-icon'></i>
          <van-count-down :time="1000*5" format="ss s" slot="button" v-if="isCountDownShow" @finish='isCountDownShow=false'/>
          <van-button slot="button" size="small" type="primary" v-else @click="onCodeShow">发送验证码</van-button>
        </van-field>
      </ValidationProvider>
    </ValidationObserver>

    <div class="login-btn">
      <van-button type="info" @click='login'>登录</van-button>
    </div>
  </div>
</template>

<script>
import { getSmsCode, onlogin } from '@/api/user.js'
import { validate } from 'vee-validate'
export default {
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      isCountDownShow: false
    }
  },
  methods: {
    async login () {
      // 1 获取表单数据
      const user = this.user
      // 2 校验手机号和验证码
      let success = await this.$refs.form.validate()
      if (!success) {
        // 获取错误信息,请提示
        // console.log('验证失败')
        // console.log(this.$refs.form.errors)
        let errors = this.$refs.form.errors
        for (const key in errors) {
          const item = errors[key]
          if (item[0]) {
            this.$toast(item[0])
            return
          }
        }
      }
      // 3 获取接口 发送请求
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await onlogin(user)
        // 将登陆成功获取的token相关信息储存到vuex中
        this.$store.commit('onSetItem', data.data)
        this.$toast.success('登录成功')
        // 跳转到原来页
        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
      } catch (error) {
        this.$toast.fail('登录失败')
      }
      // 4 后续任务
    },

    async onCodeShow () {
      try {
        //   1 验证手机号
        const { mobile } = this.user
        let validateMobile = await validate(mobile, 'required|mobile', {
          name: '手机号'
        })
        if (!validateMobile.valid) {
          console.log(validateMobile)
          this.$toast(validateMobile.errors[0])
          return
        }
        //   2 显示倒计时
        this.isCountDownShow = true
        //   3 获取接口
        await getSmsCode(mobile)
      } catch (error) {
        this.isCountDownShow = false
        this.$toast('请勿频繁操作')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.login-container {
  .login-btn {
    margin: 27px 16px;
    .van-button {
      width: 100%;
      background-color: #6db4fb;
    }
  }
  .van-button{
      background-color: #6db4fb;
  }
  .van-cell{
      align-items: center;
  }
}
</style>
