import { useState } from 'react';
import styles from './index.module.scss';

interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  console.log(props);
  const { isShow = false } = props;
  const [form, setForm] = useState({
    phone: '', // 手机号
    verify: '', // 验证码
  });

  console.log(setForm);

  const handleClose = () => {};

  const handleGetVerifyCode = () => {};

  const handleLogin = () => {};

  const handleOAuthGithub = () => {};

  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登陆</div>
          <div className={styles.close} onClick={handleClose}>
            x
          </div>
          <input
            name="phone"
            type="text"
            placeholder="请输入手机号"
            value={form.phone}
          />
          <div className={styles.verifyCodeArea}>
            <input
              name="verify"
              type="text"
              placeholder="请输入验证码"
              value={form.verify}
            />
            <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
              获取验证码
            </span>
          </div>
          <div className={styles.loginBtn} onClick={handleLogin}>
            登陆
          </div>
          <div className={styles.otherLogin} onClick={handleOAuthGithub}>
            使用 Github 登陆
          </div>
          <div className={styles.loginPrivacy}>
            注册登陆即表示同意
            <a
              href="https://juejin.cn/user/4117039159453656/posts"
              target="_blank"
              rel="noreferrer"
            >
              隐私政策
            </a>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Login;
