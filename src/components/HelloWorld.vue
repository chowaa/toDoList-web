<script setup lang="ts">
import { getTodoListApi } from '../api'
import { ref, watch, reactive } from 'vue'
import _lodash from 'lodash'

interface TodoDto {
  title: string
  content: string
  createdAt: string
  effectiveTime: string
  isCompleted: boolean
  completedTime: string
}

const valueRef = ref<TodoDto[]>([])

const response = async () => {
  try {
    const res = await getTodoListApi()
    console.log(res.data.data)
    valueRef.value = res.data.data
  } catch (error) {
    console.error('Failed to fetch todo list:', error)
  }
}

const calendarRef = ref(new Date())
const selectDateValueRef = ref('')

const changeDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-')
}

watch(calendarRef, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    selectDateValueRef.value = changeDate(newValue)
  }
})

const isCalendarBtnActive = ref(false)
interface DateCellData {
  day: string;
  date: Date;
  isSelected: boolean;
  isToday: boolean;
}
let oldData: DateCellData | null = null

const setCalendarHeight = (isActive: boolean) => {
  document.documentElement.style.setProperty(
    '--calendar-selected-height',
    isActive ? "70vh" : '85px',
    'important'
  );
};

const changeCalendarBtnActive = async (data: DateCellData) => {
  console.log(oldData, data);

  if (_lodash.isEqual(oldData, data)) {
    isCalendarBtnActive.value = false;
    oldData = null;
    setCalendarHeight(isCalendarBtnActive.value);
    return;
  }

  isCalendarBtnActive.value = true;
  setCalendarHeight(isCalendarBtnActive.value);
  oldData = data;
};

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
        <div @click="changeCalendarBtnActive(data)">
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
    }
  }
}
</style>
