// 查询对应标签文章的接口
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { prepareConnection } from 'db/index';
import { Article } from 'db/entity/index';

// 通过withIronSessionApiRoute把路由函数包裹之后，就在req中存在session属性了
export default withIronSessionApiRoute(get, ironOptions);

// 路由处理函数
async function get(req: NextApiRequest, res: NextApiResponse) {
  const { tag_id = 0 } = req?.query || {};
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);

  let articles = [];

  if (tag_id) {
    articles = await articleRepo.find({
      relations: ['user', 'tags'],
      where: (qb: any) => { // 找出文章标签等于当前选中标签的文章
        qb.where('tag_id = :id', {
          id: Number(tag_id),
        });
      },
    });
  } else {
    articles = await articleRepo.find({
      relations: ['user', 'tags'],
    });
  }

  res?.status(200)?.json({
    code: 0,
    msg: '',
    data: articles || [],
  });
}
