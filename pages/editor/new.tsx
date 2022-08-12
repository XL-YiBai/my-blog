import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import {observer} from 'mobx-react-lite';
import { ChangeEvent, useEffect, useState } from 'react';
import { Input, Button, message, Select } from 'antd';
import { useRouter } from 'next/router';
import {useStore} from 'store/index';
import request from 'service/fetch';
import styles from './index.module.scss';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor = () => {
  const store = useStore()
  const {userId} = store.user.userInfo
  const {push} = useRouter()
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagIds, setTagIds] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res.code === 0) {
        setAllTags(res?.data?.allTags || [])
      }
    })
  }, [])

  // 点击发布的回调
  const handlePublish = () => {
    if (!title.trim()) {
      message.warn('请输入文章标题')
      return;
    }
    request.post('/api/article/publish', {
      title,
      content,
      tagIds
    }).then((res: any) => {
      if (res?.code === 0) {
        // 发布完之后跳转到个人中心页面
        userId ? push(`/user/${userId}`) : push('/')
        message.success('发布成功');
      } else {
        message.error(res?.msg || '发布失败')
      }
    })
  };

  // 文章标题改变的回调
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  // 文章内容改变的回调
  const handleContentChange = (content: any) => {
    setContent(content)
  }

  // 选择文章标签的onChange回调
  const handleSelectTag = (value: []) => {
    setTagIds(value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={handleTitleChange}
        />
        <Select 
          className={styles.tag}
          mode="multiple"
          allowClear
          placeholder="请选择标签"
          onChange={handleSelectTag}
        >{
          allTags.map((tag: any) => (
            <Select.Option key={tag?.id} value={tag?.id}>{tag.title}</Select.Option>
          ))
        }</Select>
        <Button
          className={styles.button}
          type="primary"
          onClick={handlePublish}
        >
          发布
        </Button>
      </div>
      <MDEditor value={content} height={1080} onChange={handleContentChange} />
    </div>
  );
};

// 在组件上挂载一个layout为null表示不渲染Layout(页头页脚)
(NewEditor as any).layout = null;

export default observer(NewEditor);
