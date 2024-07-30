<script setup lang="ts">
import { getTodoListApi } from '../api'
import { ref } from 'vue'

interface TodoDto {
  title: string
  content: string
  createdAt: string
  effectiveTime: string
  isCompleted: boolean
  completedTime: string
}

const response = async ()=> {
  const res = await getTodoListApi()
  console.log(res.data.data)
  valueRef.value = res.data.data
  // return res.data.data
}

const valueRef = ref<TodoDto[]>()
// console.log(response())
</script>

<template>
  <div>
    1111
    <el-button @click="response">开始</el-button>
    <div v-for="(item, index) in valueRef" :key="index">
      <div>{{ item.title }}</div>
      <div>{{ item.completedTime }}</div>
      <div>{{ item.createdAt }}</div>
      <div>{{ item.effectiveTime }}</div>
      <div>{{ item.completedTime }}</div>
      <div>{{ item.isCompleted }}</div>
    </div>
<!--    <div>{{ valueRef }}</div>-->
  </div>
</template>

<style scoped>
</style>
