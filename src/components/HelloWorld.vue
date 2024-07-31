<script setup lang="ts">
import { getTodoListApi } from '../api'
import { ref, watch, reactive } from 'vue'

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

let isCalendarBtnActive = ref(false)
// interface DateCellData {
//   day: string;
//   date: Date;
//   isSelected: boolean;
//   isToday: boolean;
// }
const changeCalendarBtnActive = () => {
  isCalendarBtnActive.value = !isCalendarBtnActive.value
  document.documentElement.style.setProperty(
    '--calendar-selected-height',
    isCalendarBtnActive.value ? '300px' : '85px',
    'important'
  )
}

const createTodoListForm = reactive<TodoDto>({
  title: '',
  content: '',
  createdAt: '',
  effectiveTime: '',
  isCompleted: false,
  completedTime: ''
})

</script>

<template>
  <div class="container">
    <el-calendar v-model="calendarRef">
      <template #date-cell="{ data }">
        <div @click="changeCalendarBtnActive">
          <p :class="data.isSelected ? 'is-selected-p' : ''">
            {{ data.day.split("-").slice(2).join("-") }}
            {{ data.isSelected ? '✔️' : '' }}
          </p>
        </div>
        <div class="calendar-dropDown" v-if="isCalendarBtnActive && data.isSelected">
          <div class="calendar-dropDown-content">
            <el-form :model='createTodoListForm' class="demo-form-inline">
              <el-form-item label="title">
                <el-input v-model="createTodoListForm.title" placeholder="placeholder"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
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
  </div>
</template>

<style scoped lang="scss">
$width-content: 500px;
.container {
  width: $width-content;
  .is-selected {
    margin-bottom: 100px;
  }
  :deep(.el-calendar-table td) {
    border: none !important;
  }
  :deep(.current,) {
    overflow: auto;
    width: 100%;
    height: 85px !important;
  }
  :deep(.el-calendar-table__row) {
    height: 85px;
    overflow: auto;
    & .container {
      display: inline-block;
    }
  }
  :deep(.is-selected){
    height: var(--calendar-selected-height) !important;
  }

  .calendar-dropDown {
    position: absolute;
    .calendar-dropDown-content {
      position: relative;
      right: calc(($width-content/7)*3);
      //width: $width-content;
    }
  }
}

</style>
