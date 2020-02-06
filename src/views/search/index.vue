<template>
  <div class="search-container">
    <form action="/" class="search">
      <van-search
        v-model="searchContent"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchContent)"
        @cancel="onCancel"
        @input="getAllSuggestions"
        @focus="isResultShow=false"
      />
    </form>
    <div class="content">
      <!-- 搜索结果 -->
      <search-results v-if="isResultShow" :q="searchContent" />

      <!-- 联想记忆 -->
      <van-cell-group v-else-if="searchContent">
        <van-cell
          icon="search"
          v-for="(item,index) in suggestions"
          :key="index"
          @click="onSearch(item)"
        >
          <div slot="title" v-html="highlight(item)"></div>
        </van-cell>
      </van-cell-group>

      <!-- 历史记录 -->
      <van-cell-group v-else>
        <van-cell title="历史记录">
          <div v-if='isDeleteShow'>
            <span @click='historyRecords=[]'>全部删除</span>
            <span @click='isDeleteShow=false'>完成</span>
          </div>
          <van-icon name="delete" v-else @click='isDeleteShow=true'/>
        </van-cell>
        <van-cell :title="item" v-for="(item,index) in historyRecords" :key="index" @click='deleteCell(item,index)'>
          <van-icon name="close" v-show='isDeleteShow'/>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import searchResults from './components/search-results'
import { getSuggestions } from '@/api/search'
import { debounce } from 'lodash'
import { setItem, getItem } from '@/utils/storage'
export default {
  data () {
    return {
      searchContent: '',
      isResultShow: false,
      suggestions: [],
      historyRecords: getItem('history-records') || [],
      isDeleteShow: false
    }
  },
  watch: {
    historyRecords (val) {
      setItem('history-records', val)
    }
  },
  components: { searchResults },
  methods: {
    onSearch (q) {
      this.searchContent = q
      const index = this.historyRecords.indexOf(q)
      if (index !== -1) {
        this.historyRecords.splice(index)
      }
      this.historyRecords.unshift(q)

      this.isResultShow = true
    },
    onCancel () {},
    getAllSuggestions: debounce(async function () {
      const searchContent = this.searchContent
      if (!searchContent) {
        return
      }
      const { data } = await getSuggestions(searchContent)
      //   console.log(data)
      this.suggestions = data.data.options
    }, 300),
    highlight (str) {
      const reg = new RegExp(this.searchContent, 'gi')
      return str.replace(
        reg,
        `<span style='color:red'>${this.searchContent}</span>`
      )
    },
    deleteCell (item, index) {
      if (this.isDeleteShow) {
        this.historyRecords.splice(index, 1)
      } else {
        this.onSearch(item)
      }
    }
  }
}
</script>

<style>
.search {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}
.content {
  padding-top: 54px;
}
</style>
