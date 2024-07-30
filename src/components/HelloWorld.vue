<script setup lang="ts">
import { getTodoListApi } from '../api'
import { ref, watch } from 'vue'

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
}

const valueRef = ref<TodoDto[]>()

// 接受calendar组件的值
const calendarRef = ref(new Date())
// 转换成“yyyy-mm-dd”格式
const selectDateValueRef = ref('')
const changeDate = (date: Date):string => {
  const _date = new Date(date);
  return _date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-')
}
watch(calendarRef, (newValue, oldValue) => {
  if (newValue!== oldValue) {
    selectDateValueRef.value = changeDate(newValue)
  }
}, { immediate: false })
</script>

<template>
  <div>
    <el-calendar v-model="calendarRef">
      <template #date-cell="{ data }">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split("-").slice(2).join("-") }}
          {{ data.isSelected ? '✔️' : '' }}
        </p>
      </template>
    </el-calendar>
    <el-button @click="response">开始</el-button>
    <div v-for="(item, index) in valueRef" :key="index">
      <div>{{ item.title }}</div>
      <div>{{ item.completedTime }}</div>
      <div>{{ item.createdAt }}</div>
      <div>{{ item.effectiveTime }}</div>
      <div>{{ item.completedTime }}</div>
      <div>{{ item.isCompleted }}</div>
    </div>
    <span>{{ selectDateValueRef }}</span>
<!--    <div>{{ valueRef }}</div>-->
  </div>
</template>

<style scoped>
</style>
