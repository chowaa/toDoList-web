<style scoped lang="scss">
$day-tips-w-h : 10px;
.event-content {
  display: flex;
  align-items: center;
  justify-content: center;
  .day-tips {
    width: $day-tips-w-h;
    height: $day-tips-w-h;
    border-radius: calc($day-tips-w-h/2);
  }
}
//:deep(.v-calendar-weekly__day-alldayevents-container) {
//  display: flex;
//  flex-direction: column;
//  align-items: center;
//}

</style>

<template>
  <div>
    <v-sheet :elevation="14" width="80vw" rounded>
<!--      <v-stepper-header>-->
<!--        <v-select v-model="type" :items="types" class="ma-2" label="查看模式" variant="outlined" dense hide-details></v-select>-->
<!--        <v-select v-model="weekday" :items="weekdays" class="ma-2" label="工作日" variant="outlined" dense hide-details></v-select>-->
<!--      </v-stepper-header>-->
      <v-calendar
        ref="calendar"
        v-model="value"
        :events="events"
        :view-mode="type"
        :weekdays="weekday"
      >
        <template #event="{ event }">
          <div class="event-content">
            <div class="day-tips" :style="{ background: event.color as string }"></div>
            <span>{{ event.title }}</span>
          </div>
        </template>
      </v-calendar>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { VCalendar } from 'vuetify/labs/VCalendar'
import { onMounted, ref } from 'vue'
import { useDate } from 'vuetify'
import { getTodoListApi } from '../../api'

interface Event {
  title: string;
  start: Date;
  end: Date;
  color: string;
  allDay: boolean;
  isCompleted?: boolean
  content?: string
}

// interface Weekday {
//   title: string;
//   value: number[];
// }

interface TodoDto {
  title: string
  content: string
  createdAt: string
  effectiveTime: string
  isCompleted: boolean
  completedTime: string
}

// const valueRef = ref<TodoDto[]>([])

const response = async () => {
  try {
    const res = await getTodoListApi()
    console.log(res.data.data)
    return res.data.data
  } catch (error) {
    console.error('Failed to fetch todo list:', error)
  }
}

const type = ref<'month' | 'week' | 'day'>('month');
// const types = ['month', 'week', 'day'];
const weekday = ref<number[]>([0, 1, 2, 3, 4, 5, 6]);
// const weekdays: Weekday[] = [
//   { title: '日 - 六', value: [0, 1, 2, 3, 4, 5, 6] },
//   { title: '一 - 日', value: [1, 2, 3, 4, 5, 6, 0] },
//   { title: '一 - 五', value: [1, 2, 3, 4, 5] },
//   { title: '一, 三, 五', value: [1, 3, 5] },
// ];
const value = ref<Date[]>([new Date()]);
const events = ref<Event[]>([]);
const colors = ['blue', 'indigo', 'purple', 'cyan', 'green', 'orange', 'grey'];
// const titles = ['会议', '假期', 'PTO', '旅行', '事件', '生日', '会议', '派对'];

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // 月份从 0 开始
};

const getEvents = async ({ start, end }: { start: Date; end: Date }) => {
  const eventsList: Event[] = [];

  console.log(start, end)

  const result = await getTodoListApi()

  result.data.data.map((todo: TodoDto) => {
    eventsList.push({
      title: todo.title,
      start: new Date(todo.createdAt), // 将 createdAt 转换为 Date 对象
      end: new Date(todo.completedTime), // 将 completedTime 转换为 Date 对象
      color: colors[rnd(0, colors.length - 1)], // 根据需要设置颜色
      allDay: false, // 根据需要设置是否为全天事件
      isCompleted: todo.isCompleted,
      content: todo.content
    })
  })
  events.value = eventsList;
};

const getEventColor = (event: Event) => {
  console.log(event)
  return event.color;
};

const rnd = (a: number, b: number) => {
  return Math.floor((b - a + 1) * Math.random()) + a;
};

onMounted(() => {
  const adapter = useDate();
  response()
  getEvents({
    start: adapter.startOfDay(adapter.startOfMonth(new Date())) as Date,
    end: adapter.endOfDay(adapter.endOfMonth(new Date())) as Date
  });
});
</script>
