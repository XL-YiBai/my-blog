// github三方登录授权后重定向的接口
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import request from 'service/fetch';
import { setCookie } from 'utils/index';
import { prepareConnection } from 'db/index';
import { User, UserAuth } from 'db/entity/index';

// 通过withIronSessionApiRoute把路由函数包裹之后，就在req中存在session属性了
export default withIronSessionApiRoute(redirect, ironOptions);

// 路由处理函数
async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  // http://localhost:3000/api/oauth/redirect?code=xxxxx
  const { code } = req.query || {};

  const githubClientID = '83bdfbabf1b8ab7d015b';
  const githubSecrect = '9d0fb3061da4a759a22a11a931cbec4342243328';
  const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubSecrect}&code=${code}`;

  const result = await request.post(
    url,
    {},
    {
      headers: {
        accept: 'application/json',
      },
    }
  );

  // github颁发的令牌
  const { access_token } = result as any;

  const githubUserInfo = await request.get('https://api.github.com/user', {
    headers: {
      accept: 'application/json',
      Authorization: `token ${access_token}`
    }
  })

  // 获取github用户信息  login是用户名、avatar_url是github头像链接
  const { id: github_id, login = "", avatar_url = "" } = githubUserInfo as any;

  const cookies = Cookie.fromApiRoute(req, res);
  const db = await prepareConnection();
  const userAuth = await db.getRepository(UserAuth).findOne({
    identity_type: 'github',
    identifier: github_id
  }, {
    relations: ['user']
  });

  // 如果github登录方式能找到，说明是已经注册过的
  if (userAuth) {
    // 之前登录过的用户，直接从 user 里面获取用户信息，并且更新 creatential
    const user = userAuth.user;
    const {id, nickname, avatar} = user;

    userAuth.credential = access_token

    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;
    await session.save();

    setCookie(cookies, { id, nickname, avatar });

    // 登录成功之后重定向到首页
    res.redirect('/')
  } else {
    // 之前没有登录过，就注册一个新用户，包括user和userAuth
    const user = new User();
    user.nickname = login;
    user.avatar = avatar_url;
    user.job = '暂无';
    user.introduce = '暂无';

    const userAuth = new UserAuth();
    userAuth.identity_type = 'github';
    userAuth.identifier = github_id;
    userAuth.credential = access_token;
    userAuth.user = user;

    const userAuthRepo = db.getRepository(UserAuth);
    const resUserAuth = await userAuthRepo.save(userAuth);

    const { id, nickname, avatar } = resUserAuth?.user || {};
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;
    await session.save();

    setCookie(cookies, { id, nickname, avatar });

    // 重定向到首页
    res.redirect('/')
  }
}
