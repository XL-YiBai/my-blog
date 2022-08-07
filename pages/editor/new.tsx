import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useState } from 'react';
import { Input, Button } from 'antd';
import styles from './index.module.scss';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 点击发布的回调
  const handlePublish = () => {
    
  };

  // 文章标题改变的回调
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  // 文章内容改变的回调
  const handleContentChange = (content: any) => {
    setContent(content)
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

export default NewEditor;
