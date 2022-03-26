import http from '@/utils/request'
import { SAVE_PROFILE, SAVE_USER } from '../action_types/profile'

/**
 * 保存用户信息
 * @param {*} payload
 * @returns
 */
export const saveUser = (payload) => {
  return {
    type: SAVE_USER,
    payload,
  }
}

/**
 * 获取用户信息
 * @returns Promise
 */
export const getUser = () => {
  return async (dispatch) => {
    const res = await http.get('/user')
    dispatch(saveUser(res.data))
  }
}

export const saveProfile = (payload) => {
  return {
    type: SAVE_PROFILE,
    payload,
  }
}

export const getProfile = () => {
  return async (dispatch) => {
    const res = await http.get('/user/profile')
    dispatch(saveProfile(res.data))
  }
}

// 修改用户的信息
export const updateProfile = (data) => {
  return async (dispatch) => {
    await http.patch('/user/profile', data)
    dispatch(getProfile())
  }
}

export const updatePhoto = (fd) => {
  return async (dispatch) => {
    await http.patch('/user/photo', fd)
    dispatch(getProfile())
  }
}
