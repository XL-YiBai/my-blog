// 该文件用来统一定义一些code字段和msg的映射关系

// 用户信息接口相关的错误
export const EXCEPTION_USER = {};

// 文章接口相关的错误
export const EXCEPTION_ARTICLE = {
  PUBLISH_FAILED: {
    code: 2001,
    msg: '发布文章失败',
  },
  UPDATE_FAILED: {
    code: 2002,
    msg: '更新文章失败',
  },
  NOT_FOUND: {
    code: 2003,
    msg: '未找到文章'
  }
};


// 评论接口相关的错误
export const EXCEPTION_COMMENT = {
  PUBLISH_FAILED: {
    code: 4001,
    msg: '发表失败',
  },
}