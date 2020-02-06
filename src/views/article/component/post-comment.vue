<template>
  <div class="post-comment">
      <van-row type="flex" align='center'>
        <van-col span="20">
          <van-field
            :value='value'
            @input="$emit('input', $event)"
            rows="2"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入留言"
            show-word-limit
          />
        </van-col>
        <van-col span="4">
          <van-button @click="$emit('click-post')">发布</van-button>
        </van-col>
      </van-row>
  </div>
</template>

<script>
export default {
  name: 'PostComment',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style>

</style>
