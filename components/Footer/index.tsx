import { NextPage } from 'next';
import styles from './index.module.scss';

const Footer: NextPage = () => {
  return (
    <div className={styles.footer}>
      <p>
        技术栈：Next.js + React + TypeScript + Antd + Mobx + Node.js + Mysql
      </p>
    </div>
  );
};

export default Footer;
