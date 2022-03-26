import React, { useEffect, useState } from 'react'
import styles from './index.module.scss'
import Tabs from '@/components/Tabs'
import { useDispatch } from 'react-redux'
import {
  getAllChannels,
  getUserChannels,
  setMoreAction,
} from '@/store/actions/home'
import { useSelector } from 'react-redux'
import Icon from '@/components/Icon'
import { Drawer } from 'antd-mobile'
import Channels from './components/Channels'
import ArticleList from './components/ArticleList'
import MoreAction from './components/MoreAction'
export default function Home() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUserChannels())
    dispatch(getAllChannels())
  }, [dispatch])

  const [open, setOpen] = useState(false)
  const onClose = () => {
    setOpen(false)
  }

  const tabs = useSelector((state) => state.home.userChannels)

  // 控制高亮
  const [active, setActive] = useState(0)
  const changeActive = (e) => {
    setActive(e)
    dispatch(
      setMoreAction({
        visible: false,
        articleId: '',
        channelId: tabs[e].id,
      })
    )
  }
  return (
    <div className={styles.root}>
      <Tabs tabs={tabs} index={active} onChange={changeActive}>
        {tabs.map((item) => (
          <ArticleList
            key={item.id}
            channelId={item.id}
            activeId={tabs[active].id}
          ></ArticleList>
        ))}
      </Tabs>
      {/* 频道 Tab 栏右侧的两个图标按钮：搜索、频道管理 */}
      <div className="tabs-opration">
        <Icon type="iconbtn_search" />
        <Icon type="iconbtn_channel" onClick={() => setOpen(true)} />
      </div>
      {/* 频道管理组件 */}
      <Drawer
        className="my-drawer"
        position="left"
        children={''}
        sidebar={
          open && (
            <Channels
              onClose={onClose}
              index={active}
              onChange={changeActive}
            ></Channels>
          )
        }
        open={open}
      ></Drawer>
      <MoreAction></MoreAction>
    </div>
  )
}
