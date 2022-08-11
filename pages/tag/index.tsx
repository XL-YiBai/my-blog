import React, { useState, useEffect } from 'react';
import {observer} from 'mobx-react-lite';
import { Button, Tabs } from 'antd';
import * as ANTD_ICONS from '@ant-design/icons' // 先把antd的icon导出到ANTD_ICONS的对象
import { useStore } from 'store/index';
import request from 'service/fetch';
import styles from './index.module.scss';

const { TabPane } = Tabs

interface IUser {
  id: number;
  nickname: string;
  avatar: string;
}

interface ITag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: IUser[];
}

const Tag = () => {
  const store = useStore();
  const [followTags, setFollowTags] = useState<ITag[]>(); // 用户关注标签
  const [allTags, setAllTags] = useState<ITag[]>(); // 所有标签
  const { userId } = store?.user?.userInfo;

  useEffect(() => {
    // 获取标签信息并存储
    request('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        const { followTags = [], allTags = []} = res?.data;
        setFollowTags(followTags);
        setAllTags(allTags);
      }
    })
  }, [])

  const handleUnFollow = (tagId) => {

  }

  const handleFollow = (tagId) => {

  }

  return (
    <div className='content-layout'>
      <Tabs defaultActiveKey="all">
        <TabPane tab="已关注标签" key="follow" className={styles.tags}>
          {
            followTags?.map(tag => (
              <div key={tag?.title} className={styles.tagWrapper}>
                <div>{ANTD_ICONS[tag.icon]?.render()}</div>
                <div className={styles.title}>{tag?.title}</div>
                <div>{tag.follow_count} 关注 {tag?.article_count}</div>
                {/* 如果标签的关注用户中存在当前登录的用户，就展示取消关注按钮，否则展示关注按钮 */}
                {
                  tag?.users?.find((user) => Number(user.id) === Number(userId)) ? (
                    <Button type="primary" onClick={() => handleUnFollow(tag.id)}>已关注</Button>
                  ) : (
                    <Button onClick={() => handleFollow(tag.id)}>关注</Button>
                  )
                }
              </div>
            ))
          }
        </TabPane>
        <TabPane tab="全部标签" key="all" className={styles.tags}>
          {
            allTags?.map(tag => (
              <div key={tag?.title} className={styles.tagWrapper}>
                <div>{ANTD_ICONS[tag.icon]?.render()}</div>
                <div className={styles.title}>{tag?.title}</div>
                <div>{tag.follow_count} 关注 {tag?.article_count}</div>
                {/* 如果标签的关注用户中存在当前登录的用户，就展示取消关注按钮，否则展示关注按钮 */}
                {
                  tag?.users?.find((user) => Number(user.id) === Number(userId)) ? (
                    <Button type="primary" onClick={() => handleUnFollow(tag.id)}>已关注</Button>
                  ) : (
                    <Button onClick={() => handleFollow(tag.id)}>关注</Button>
                  )
                }
              </div>
            ))
          }
        </TabPane>
      </Tabs>
    </div>
  )
};

export default observer(Tag);
