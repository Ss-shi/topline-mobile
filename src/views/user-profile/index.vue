<template>
  <div class="user-profile">
    <van-nav-bar
    title="编辑资料"
    left-text="返回"
    left-arrow
    @click-left="$router.back()"
    />
    <van-cell-group>
      <van-cell title="头像" is-link @click='onAvatarClick'>
        <van-image class='avatar' round :src="user.photo"/>
      </van-cell>
      <input type='file' ref='file' hidden @change='onAvatarChange'>
      <van-cell title="昵称" is-link :value="user.name" @click="isNameShow=true" />
      <van-cell title="性别" is-link :value="user.gender === 1 ? '女' : '男'" @click="isGenderShow=true"/>
      <van-cell title="生日" is-link :value="user.birthday" @click="isBirthdayShow=true"/>
    </van-cell-group>

    <!-- 头像预览 -->
    <van-image-preview v-model="isAvatarShow" :images="images" @close="$refs.file.value=''">
      <van-nav-bar
        slot='cover'
        left-text="取消"
        right-text="确定"
        @click-left="isAvatarShow=false"
        @click-right="onClickRight"
      />
    </van-image-preview>

    <!-- 昵称弹层 -->
    <van-popup v-model="isNameShow" position="bottom">
      <van-nav-bar
        title='昵称'
        left-text="取消"
        right-text="确定"
        @click-left="isNameShow=false"
        @click-right="onNameClick"
      />
      <van-field
        :value="user.name"
        @input="inputName=$event"
        rows="2"
        autosize
        type="textarea"
        maxlength="20"
        placeholder="请输入昵称"
        show-word-limit
      />
    </van-popup>

    <!-- 性别弹层 -->
    <van-action-sheet
      v-model="isGenderShow"
      :actions="actions"
      cancel-text="取消"
      @cancel="isGenderShow=false"
      @select="onGenderSelect"
    />

    <!-- 时间弹层 -->
    <van-popup v-model="isBirthdayShow" position="bottom">
      <van-datetime-picker
        :value="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel='isBirthdayShow=false'
        @confirm='updateBirthday'
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import moment from 'moment'
export default {
  name: 'userProfile',
  data () {
    return {
      user: {},
      isAvatarShow: false,
      images: [],
      isNameShow: false,
      inputName: '',
      isGenderShow: false,
      actions: [
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ],
      isBirthdayShow: false,
      minDate: new Date(1950, 0, 1),
      maxDate: new Date()
      // currentDate: new Date()
    }
  },
  computed: {
    file () {
      return this.$refs['file']
    },
    currentDate () {
      return new Date(this.user.birthday)
    }
  },
  methods: {
    async updateBirthday (value) {
      const date = moment(value).format('YYYY-MM-DD')
      await this.updateProfile('birthday', date)
      this.user.birthday = date
      this.isBirthdayShow = false
    },
    async onGenderSelect (data) {
      await this.updateProfile('gender', data.value)
      this.user.gender = data.value
      this.isGenderShow = false
    },
    async onNameClick () {
      await this.updateProfile('name', this.inputName)
      this.user.name = this.inputName
      this.isNameShow = false
    },
    async updateProfile (field, value) {
      this.$toast.loading({
        message: '更新中...',
        forbidClick: true,
        duration: 0
      })
      try {
        await updateUserProfile({
          [field]: value
        })
        this.$toast.success('更新成功')
      } catch (error) {
        console.log(error)
        // this.$toast.fail('更新失败')
      }
    },
    async loadUserProfile () {
      const { data } = await getUserProfile()
      this.user = data.data
    },
    onAvatarClick () {
      this.file.click()
    },
    onAvatarChange () {
      const fileObj = this.file.files[0]
      const fileData = window.URL.createObjectURL(fileObj)
      this.images = [fileData]
      this.isAvatarShow = true
    },
    async onClickRight () {
      const fd = new FormData()
      fd.append('photo', this.file.files[0])
      this.$toast.loading({
        message: '更新中...',
        forbidClick: true,
        duration: 0
      })
      try {
        const { data } = await updateUserPhoto(fd)
        this.user.photo = data.data.photo
        this.isAvatarShow = false
        this.$toast.success('更新成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('更新失败')
      }
    }
  },
  created () {
    this.loadUserProfile()
  }
}
</script>

<style lang='less' scoped>
.user-profile{
  .avatar{
    width:30px;
    height: 30px;
  }
  /deep/ .van-image-preview__cover{
    top: unset;
    right: 0;
    bottom: 0;
    .van-nav-bar{
      background: #000;
    }
  }
  .van-popup{
    .van-nav-bar{
      background: #fff;
      .van-nav-bar__title {
        color: #000
      }
    }
  }
}
</style>
