<template>
  <div class="edit-container">
    <van-cell title="我的频道">
      <van-button
        type="danger"
        size="mini"
        round
        @click="isEditShow=!isEditShow"
      >{{ isEditShow ? "完成":"编辑"}}</van-button>
    </van-cell>
    <van-grid :gutter="10" :border="false">
      <van-grid-item
        v-for="(item,index) in userChannels"
        :key="item.id"
        @click="onUserChannelClick(index)"
      >
        <van-icon name="close" slot="icon" size="14px" v-show="isEditShow && index !==0" />
        <span slot="text" class="text" :class="{active: index===active}">{{item.name}}</span>
      </van-grid-item>
    </van-grid>
    <van-cell title="推荐频道" />
    <van-grid :gutter="10" :border="false">
      <van-grid-item
        v-for="item in restChannles"
        :key="item.id"
        :text="item.name"
        @click="onAdd(item)"
      />
    </van-grid>
  </div>
</template>

<script>
import { AllChannels } from '@/api/channels'
import { setItem } from '@/utils/storage'
export default {
  name: 'edit',
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allchannel: [],
      isEditShow: false
    }
  },
  watch: {
    userChannels (newVal) {
      setItem('user-channel', newVal)
    }
  },
  methods: {
    async getAllChannels () {
      const { data } = await AllChannels()
      this.allchannel = data.data.channels
    },
    onAdd (channel) {
      this.userChannels.push(channel)
    },
    onUserChannelClick (index) {
      // 如果是编辑状态，点击删除
      if (this.isEditShow) {
        this.userChannels.splice(index, 1)
      } else {
        // 如果是非编辑状态，点击切换
        this.$emit('switch', index)
      }
    }
  },
  created () {
    this.getAllChannels()
  },
  computed: {
    restChannles () {
      const channels = []
      this.allchannel.forEach(item => {
        if (!this.userChannels.find(user => user.id === item.id)) {
          channels.push(item)
        }
      })
      return channels
    }
  }
}
</script>

<style lang='less' scoped>
.edit-container {
  padding-top: 40px;
  /deep/ .van-grid-item__content {
    background-color: #f4f5f6;
    position: relative;
    /deep/ .van-grid-item__icon-wrapper {
      position: absolute;
      top: -28px;
      right: -5px;
    }
    .active {
      color: red;
    }
    .text {
      font-size: 14px;
    }
  }
}
</style>
