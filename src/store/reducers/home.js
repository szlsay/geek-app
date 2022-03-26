import {
  SAVE_ALL_CHANNELS,
  SAVE_ARTICLE_LIST,
  SAVE_CHANNELS,
  SAVE_MORE_ARTICLE_LIST,
} from '../action_types/home'

const initValue = {
  userChannels: [],
  allChannels: [],
  // 存储所有的文章列表
  articles: {},
  moreAction: {
    visible: false,
    articleId: '',
    channelId: '',
  },
}
export default function reducer(state = initValue, action) {
  const { type, payload } = action
  switch (type) {
    case SAVE_CHANNELS:
      return {
        ...state,
        userChannels: payload,
      }
    case SAVE_ALL_CHANNELS:
      return {
        ...state,
        allChannels: payload,
      }
    case SAVE_ARTICLE_LIST:
      const { list, timestamp, channelId } = payload

      return {
        ...state,
        articles: {
          ...state.articles,
          [channelId]: {
            timestamp: timestamp,
            // 如果是loadMore，追加数据，否则，覆盖数据
            list: list,
          },
        },
      }
    case SAVE_MORE_ARTICLE_LIST:
      return {
        ...state,
        articles: {
          ...state.articles,
          [payload.channelId]: {
            timestamp: payload.timestamp,
            list: [...state.articles[payload.channelId].list, ...payload.list],
          },
        },
      }
    case 'home/setMoreAction': {
      return {
        ...state,
        moreAction: payload,
      }
    }
    default:
      return state
  }
}
