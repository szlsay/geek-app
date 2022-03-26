import request from '@/utils/request'
import { getLocalChannels, hasToken, setLocalChannels } from '@/utils/storage'
import {
  SAVE_ALL_CHANNELS,
  SAVE_ARTICLE_LIST,
  SAVE_CHANNELS,
  SAVE_MORE_ARTICLE_LIST,
} from '../action_types/home'

/**
 * 获取用户的频道
 * @returns
 */
export const getUserChannels = () => {
  return async (dispatch) => {
    // 1. 判断用户是否登录
    if (hasToken()) {
      const res = await request.get('/user/channels')
      dispatch(saveUserChannels(res.data.channels))
    } else {
      // 2. 没有token,从本地获取频道数据
      const channels = getLocalChannels()
      if (channels) {
        // 没有token，但本地有channels数据
        dispatch(saveUserChannels(channels))
      } else {
        // 没有token, 且本地没有channels数据
        const res = await request.get('/user/channels')
        dispatch(saveUserChannels(res.data.channels))
        // 保存到本地
        setLocalChannels(res.data.channels)
      }
    }
  }
}

// 保存用户频道到redux
export const saveUserChannels = (payload) => {
  return {
    type: SAVE_CHANNELS,
    payload,
  }
}

// 获取所有频道
export const getAllChannels = () => {
  return async (dispatch) => {
    const res = await request.get('/channels')
    dispatch(saveAllChannels(res.data.channels))
  }
}

// 保存所有频道
export const saveAllChannels = (payload) => {
  return {
    type: SAVE_ALL_CHANNELS,
    payload,
  }
}

// 删除频道
export const delChannel = (channel) => {
  return async (dispatch, getState) => {
    // 如果用户登录，需要发送请求删除频道
    // 如果用户没有登录，需要删除本地中的这个频道
    // 不管登录没登录，都需要修改redux中的频道
    const userChannels = getState().home.userChannels
    if (hasToken()) {
      // 发送请求
      await request.delete('/user/channels/' + channel.id)
      // 同步频道的数据到redux中
      // console.log(res)
      dispatch(
        saveUserChannels(userChannels.filter((item) => item.id !== channel.id))
      )
    } else {
      // 没有登录
      // 修改本地，修改redux
      const result = userChannels.filter((item) => item.id !== channel.id)
      setLocalChannels(result)
      dispatch(saveUserChannels(result))
    }
  }
}

// 添加频道
export const addChannel = (channel) => {
  return async (dispatch, getState) => {
    const channels = [...getState().home.userChannels, channel]
    if (hasToken()) {
      // 发请求添加
      await request.patch('/user/channels', {
        channels: [channel],
      })
      dispatch(saveUserChannels(channels))
    } else {
      dispatch(saveUserChannels(channels))
      setLocalChannels(channels)
    }
  }
}

// 获取文章列表数据
export const getArticleList = (channelId, timestamp) => {
  return async (dispatch) => {
    const res = await request({
      method: 'get',
      url: '/articles',
      params: {
        timestamp: timestamp,
        channel_id: channelId,
      },
    })

    dispatch(
      setArticleList({
        channelId,
        timestamp: res.data.pre_timestamp,
        list: res.data.results,
      })
    )
  }
}

// 获取文章列表数据
export const getMoreArticleList = (channelId, timestamp) => {
  return async (dispatch) => {
    const res = await request({
      method: 'get',
      url: '/articles',
      params: {
        timestamp: timestamp,
        channel_id: channelId,
      },
    })

    dispatch(
      setMoreArticleList({
        channelId,
        timestamp: res.data.pre_timestamp,
        list: res.data.results,
      })
    )
  }
}

export const setArticleList = (payload) => {
  return {
    type: SAVE_ARTICLE_LIST,
    payload,
  }
}

export const setMoreArticleList = (payload) => {
  return {
    type: SAVE_MORE_ARTICLE_LIST,
    payload,
  }
}

export const setMoreAction = (payload) => {
  return {
    type: 'home/setMoreAction',
    payload,
  }
}

export const unLinkArticle = (articleId) => {
  return async (dispatch, getState) => {
    await request({
      method: 'post',
      url: '/article/dislikes',
      data: {
        target: articleId,
      },
    })
    // 把当前频道对应的文章删除
    const channelId = getState().home.moreAction.channelId
    const articles = getState().home.articles[channelId]
    console.log(articles)
    dispatch(
      setArticleList({
        channelId,
        timestamp: articles.timestamp,
        list: articles.list.filter((item) => item.art_id !== articleId),
      })
    )
  }
}

export const reportArticle = (articleId, reportId) => {
  return async (dispatch, getState) => {
    await request({
      method: 'post',
      url: '/article/reports',
      data: {
        target: articleId,
        type: reportId,
      },
    })
    // 把当前频道对应的文章删除
    const channelId = getState().home.moreAction.channelId
    const articles = getState().home.articles[channelId]
    console.log(articles)
    dispatch(
      setArticleList({
        channelId,
        timestamp: articles.timestamp,
        list: articles.list.filter((item) => item.art_id !== articleId),
      })
    )
  }
}
