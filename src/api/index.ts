import axios from '../utils/http.ts'

export const getTodoListApi = () => {
  return axios({
    url: '/todoList',
    method: 'get'
  })
}

export interface TodoDto {
  _id?: string
  title: string
  content: string
  createdAt: Date | null
  effectiveTime: string
  isCompleted: boolean
  completedTime: Date | null
}
export const createTodoList = (data:TodoDto) => {
  return axios({
    url: '/todoList/createTodoList',
    method: 'post',
    data: data
  })
}

export const todoDetail = (params: { id: string}) => {
  return axios({
    url: '/todoList/todoDetail',
    method: 'post',
    params
  })
}

export const getVersion = () => {
  return axios({
    url: '/version',
    method: 'get'
  })
}

export const postChat = (params: any) => {
  return axios({
    url: '/chat',
    method: 'post',
    data: params,
    responseType: 'stream'
  })
}

export const postPost= (params: any) => {
  return axios({
    url: '/post',
    method: 'post',
    data: params
  })
}

export const postGenerate= (params: any) => {
  return axios({
    url: '/generate',
    method: 'post',
    data: params,
  })
}
