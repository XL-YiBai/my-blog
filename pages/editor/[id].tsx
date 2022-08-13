import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import {observer} from 'mobx-react-lite';
import { ChangeEvent, useState, useEffect } from 'react';
import { Input, Button, message, Select } from 'antd';
import { useRouter } from 'next/router';
import { prepareConnection } from 'db/index';
import { Article, Tag } from 'db/entity';
import request from 'service/fetch';
import styles from './index.module.scss';
import { IArticle } from 'pages/api';

interface IProps {
  article: IArticle
  tags: []
}

export async function getServerSideProps({ params }: any) {
  const articleId = params?.id; // 这里在参数ctx解构出params可以拿到动态路由的参数
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);
  const article = await articleRepo.findOne({
    where: {
      id: articleId, // 查找条件是id等于动态路由的articleId
    },
    relations: ['user', 'tags'], // 查询文章时，把外键关联的用户信息，文章标签一并返回
  });
  const tags = article?.tags.map((tag => {
    return tag.id
  }))

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
      tags: JSON.parse(JSON.stringify(tags))
    },
  };
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const ModifyEditor = ({ article, tags }: IProps) => {
  const {push, query} = useRouter()
  const articleId = Number(query?.id); // 拿到当前路由参数文章id
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [tagIds, setTagIds] = useState(tags);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res.code === 0) {
        setAllTags(res?.data?.allTags || [])
      }
    })
  }, [article])

  // 点击发布的回调
  const handlePublish = () => {
    if (!title.trim()) {
      message.warn('请输入文章标题')
      return;
    }
    request.post('/api/article/update', {
      id: articleId,
      title,
      content,
      tagIds
    }).then((res: any) => {
      if (res?.code === 0) {
        // 更新完之后跳转到文章详情页
        articleId ? push(`/article/${articleId}`) : push('/')
        message.success('更新成功');
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
          defaultValue={tagIds}
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
          保存
        </Button>
      </div>
      <MDEditor value={content} height={1080} onChange={handleContentChange} />
    </div>
  );
};

// 在组件上挂载一个layout为null表示不渲染Layout(页头页脚)
(ModifyEditor as any).layout = null;

export default observer(ModifyEditor);
