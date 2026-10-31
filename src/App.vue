<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from './stores/user'
import MyPagination from './components/MyPagination.vue'

const store = useUserStore()
const { isLoggedIn, nickname, userInfo } = storeToRefs(store)

const page = ref(1)
const pageSize = ref(10)
const total = ref(128)

function handleLogin() {
  store.login('admin', '123456')
}
function handleLogout() {
  store.logout()
}
function handleChange(payload: { page: number; pageSize: number }) {
  page.value = payload.page
  pageSize.value = payload.pageSize
}
</script>

<template>
  <div class="app">
    <h1>Vue3 + Element Plus 测试工程</h1>

    <section>
      <h2>用户状态</h2>
      <template v-if="isLoggedIn">
        <p>欢迎回来：{{ nickname }}（{{ userInfo?.username }}）</p>
        <el-button type="danger" @click="handleLogout">退出登录</el-button>
      </template>
      <template v-else>
        <p>当前未登录</p>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </template>
    </section>

    <section>
      <h2>分页演示</h2>
      <MyPagination
        :total="total"
        v-model:page="page"
        v-model:page-size="pageSize"
        @change="handleChange"
      />
      <p>当前页：{{ page }}，每页：{{ pageSize }}，总数：{{ total }}</p>
    </section>
  </div>
</template>

<style scoped>
.app {
  max-width: 720px;
  margin: 40px auto;
  padding: 0 16px;
}
section {
  margin-bottom: 32px;
}
</style>