import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import request from 'service/fetch';
import { ISession } from 'pages/api/index';
import { ironOptions } from 'config/index';

// 通过withIronSessionApiRoute把路由函数sendVerifyCode包裹之后，就在req中存在session属性了
export default withIronSessionApiRoute(sendVerifyCode, ironOptions);

// 路由处理函数
async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  /**
   * 容联云模版短信业务接口详细配置信息：http://doc.yuntongxun.com/pe/5a533de33b8496dd00dce07c
   */
  const session: ISession = req.session;
  const { to = '', templateId = '1' } = req.body; // to就是向哪个手机号发短信，templateId是短信模版
  const AppId = '8a216da881ad975401825e8c6b272a7c';
  const AccountId = '8a216da881ad975401825e8c6a442a75';
  const AuthToken = 'cdce6ce5bba34311917fb69ccdf02654';
  const NowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`);
  /**
   * Math.floor(Math.random() * (9999 - 1000)) 随机生成0-8999，
   * 加1000之后，就是随机生成1000-9999的随机四位数验证码
   */
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expireMinute = 5; // 过期时间五分钟
  const Authorization = encode(`${AccountId}:${NowDate}`);

  // 容联云第三方接口地址
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`;

  console.log(to, templateId);

  console.log(SigParameter);
  console.log(Authorization);

  // 向第三方发送请求，让第三方向用户发短信
  const response = await request.post(
    url,
    {
      to, // to就是向哪个手机号发短信
      templateId, // templateId是短信模版
      appId: AppId,
      datas: [verifyCode, expireMinute],
    },
    {
      headers: {
        Authorization,
      },
    }
  );

  console.log(response);
  const { statusCode,templateSMS, statusMsg } = response as any;

  if (statusCode === '000000') {
    // 如果发送成功，就把验证码存到session中，之后用户点击登录时再取出进行校验
    session.verifyCode = verifyCode;
    await session.save();
    res.status(200).json({
      code: 0,
      msg: statusMsg,
      data: {
        templateSMS
      }
    });
  } else {
    res.status(200).json({
      code: statusCode,
      msg: statusMsg,
    });
  }
}
