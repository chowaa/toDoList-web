<style scoped></style>

<template>
  <div>
    <v-sheet :elevation="14" width="80vw" rounded>
      <v-stepper-header>
        <v-icon icon="$vuetify"></v-icon>
        <v-icon icon="$mdi-home">mdi-home</v-icon>
        <v-select v-model="type" :items="types" class="ma-2" label="查看模式" variant="outlined" dense hide-details></v-select>
        <v-select v-model="weekday" :items="weekdays" class="ma-2" label="工作日" variant="outlined" dense hide-details></v-select>
      </v-stepper-header>
      <v-calendar
        ref="calendar"
        v-model="value"
        :events="events"
        :view-mode="type"
        :weekdays="weekday"
      ></v-calendar>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { VCalendar } from 'vuetify/labs/VCalendar'
import { ref, onMounted } from 'vue';
import { useDate } from 'vuetify';
import { getTodoListApi } from '../../api'

interface Event {
  title: string;
  start: Date;
  end: Date;
  color: string;
  allDay: boolean;
}

interface Weekday {
  title: string;
  value: number[];
}

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

const type = ref<'month' | 'week' | 'day'>('month');
const types = ['month', 'week', 'day'];
const weekday = ref<number[]>([0, 1, 2, 3, 4, 5, 6]);
const weekdays: Weekday[] = [
  { title: '日 - 六', value: [0, 1, 2, 3, 4, 5, 6] },
  { title: '一 - 日', value: [1, 2, 3, 4, 5, 6, 0] },
  { title: '一 - 五', value: [1, 2, 3, 4, 5] },
  { title: '一, 三, 五', value: [1, 3, 5] },
];
const value = ref<Date[]>([new Date()]);
const events = ref<Event[]>([]);
const colors = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'];
const titles = ['会议', '假期', 'PTO', '旅行', '事件', '生日', '会议', '派对'];

const getEvents = ({ start, end }: { start: Date; end: Date }) => {
  const eventsList: Event[] = [];

  const min = start;
  const max = end;
  const days = (max.getTime() - min.getTime()) / 86400000;
  const eventCount = rnd(days, days + 20);

  for (let i = 0; i < eventCount; i++) {
    const allDay = rnd(0, 3) === 0;
    const firstTimestamp = rnd(min.getTime(), max.getTime());
    const first = new Date(firstTimestamp - (firstTimestamp % 900000));
    const secondTimestamp = rnd(2, allDay ? 288 : 8) * 900000;
    const second = new Date(first.getTime() + secondTimestamp);

    eventsList.push({
      title: titles[rnd(0, titles.length - 1)],
      start: first,
      end: second,
      color: colors[rnd(0, colors.length - 1)],
      allDay: !allDay,
    });
  }

  console.log(eventsList)
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
    start: adapter.startOfDay(adapter.startOfMonth(new Date())),
    end: adapter.endOfDay(adapter.endOfMonth(new Date()))
  });
});
</script>
