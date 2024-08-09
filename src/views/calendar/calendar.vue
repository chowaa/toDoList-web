<style scoped lang="scss">
$day-tips-w-h : 10px;
.event-content {
  display: flex;
  align-items: center;
  justify-content: center;
  .day-tips {
    width: $day-tips-w-h;
    height: $day-tips-w-h;
    border-radius: calc($day-tips-w-h / 2);
  }
}
</style>

<template>
  <div>
    <v-sheet :elevation="14" width="80vw" rounded>
      <v-stepper-header></v-stepper-header>

      <v-sheet style="display: inline-flex; align-items: center; flex-direction: row;">
        <v-select v-model="type" :items="types" class="ma-2" label="查看模式" variant="outlined" width="150px" dense hide-details></v-select>
        <v-btn @click="changeAddStatus">添加待办事项</v-btn>
      </v-sheet>

      <v-sheet>
        <v-expansion-panels v-model="addStatus" variant="inset">
          <v-expansion-panel title="" text="" value="addStatus">
            <v-expansion-panel-text>
              <v-form ref="todoFormRef" @submit.prevent="addTodoList">
                <v-container>
                  <v-text-field
                    v-model="addTodoListForm.title"
                    label="title"
                    hide-details
                    required
                    :rules="todoFormRules.title"
                  ></v-text-field>
                  <v-text-field
                    v-model="addTodoListForm.content"
                    label="content"
                    hide-details
                    required
                    :rules="todoFormRules.content"
                  ></v-text-field>
                  <el-date-picker
                    v-model="addTodoListForm.createdAt"
                    :rules="todoFormRules.createdAt"
                    type="datetime"
                    placeholder="Select date and time"
                  />
                  <el-date-picker
                    v-model="addTodoListForm.completedTime"
                    :rules="todoFormRules.completedTime"
                    type="datetime"
                    placeholder="Select date and time"
                  />
                </v-container>
                <v-btn class="me-4" type="submit">添加</v-btn>
              </v-form>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-sheet>

      <v-calendar
        ref="calendar"
        v-model="value"
        :events="events"
        :view-mode="type"
        :weekdays="weekday"
      >
        <template #event="{ event }">
          <div class="event-content" @click="getDetail(event._id as string)">
            <div class="day-tips" :style="{ background: event.color as string }"></div>
            <span>&nbsp;&nbsp;{{ truncateTitle(event.title as string, 5) }}</span>
          </div>
        </template>
      </v-calendar>
    </v-sheet>
  </div>
  <v-dialog
    v-model="dialogStatus"
    width="auto"
  >
    <v-card
      max-width="400"
      title="todoList detail"
    >
      <v-card-text>
        {{ todoListDetail }}
      </v-card-text>
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          text="close"
          @click="dialogStatus = false"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { VCalendar } from 'vuetify/labs/VCalendar'
import { VForm } from 'vuetify/components'
import { onMounted, reactive, ref } from 'vue'
import { getTodoListApi, createTodoList, TodoDto, todoDetail } from '../../api'

interface Event {
  _id?: string
  title: string
  start: Date
  end: Date
  color: string
  allDay: boolean
  isCompleted?: boolean
  content?: string
}

const type = ref<'month' | 'week' | 'day'>('month')
const types = ['month', 'week', 'day']
const weekday = ref<number[]>([0, 1, 2, 3, 4, 5, 6])
const value = ref<Date[]>([new Date()])
const events = ref<Event[]>([])
const colors = ['blue', 'indigo', 'purple', 'cyan', 'green', 'orange', 'grey']

const getEvents = async ({ start, end }: { start: Date; end: Date }) => {
  const eventsList: Event[] = []

  console.log(start, end)

  const result = await getTodoListApi()

  result.data.data.forEach((todo: TodoDto) => {
    eventsList.push({
      _id: todo._id,
      title: todo.title,
      start: new Date(todo.createdAt as Date), // 将 createdAt 转换为 Date 对象
      end: new Date(todo.completedTime as Date), // 将 completedTime 转换为 Date 对象
      color: colors[rnd(0, colors.length - 1)], // 根据需要设置颜色
      allDay: false, // 根据需要设置是否为全天事件
      isCompleted: todo.isCompleted,
      content: todo.content
    })
  })
  events.value = eventsList
}

const truncateTitle = (title: string, maxLength: number): string => {
  return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
};

const rnd = (a: number, b: number) => {
  return Math.floor((b - a + 1) * Math.random()) + a
}

const addStatus = ref<['addStatus'] | []>([])
const addTodoListForm = reactive<TodoDto>({
  title: '',
  content: '',
  createdAt: null,
  effectiveTime: '',
  isCompleted: false,
  completedTime: null
})
const changeAddStatus = () => {
  addStatus.value[0] === 'addStatus' ? addStatus.value = [] : addStatus.value[0] = 'addStatus'
}
const todoFormRules = {
  title: [(value: string) => !!value || '必填'],
  content: [(value: string) => !!value || '必填'],
  createdAt: [(value: Date) => !!value],
  completedTime: [(value: Date) => !!value]
}

const todoFormRef = ref<VForm | null>(null)

const addTodoList = async () => {
  const { valid } = await todoFormRef.value?.validate() || { valid: false }
  if (valid) {
    createTodoList(addTodoListForm).then(res => {
      if (res.data.code === 200) {
        changeAddStatus()
        updateTodolist()
      } else {
        alert(res.data.message)
      }
    })
  }
}

const dialogStatus = ref<boolean>(false)
let todoListDetail = reactive<TodoDto>({
  title: '',
  content: '',
  createdAt: null,
  effectiveTime: '',
  isCompleted: false,
  completedTime: null
})
const getDetail = (id:string) => {
  dialogStatus.value = true
  todoDetail({ id:id }).then(res => {
    todoListDetail = res.data.data
  })
}

const updateTodolist = () => {
  getEvents({
    start: new Date(),
    end: new Date()
  })
}

onMounted(() => {
  updateTodolist()
})
</script>
