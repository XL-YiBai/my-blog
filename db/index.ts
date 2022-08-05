// 数据库入口文件，，导出一个connection函数
import 'reflect-metadata';
import { Connection, createConnection, getConnection } from 'typeorm';
import { User, UserAuth } from './entity/index';

const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

// 定义一个连接类型，，等下在prepareConnection函数中返回
let connectionReadyPromise: Promise<Connection> | null = null;

export const prepareConnection = () => {
  if (!connectionReadyPromise) {
    connectionReadyPromise = (async () => {
      try {
        const staleConnection = getConnection();
        await staleConnection.close();
      } catch (error) {
        console.log(error);
      }

      const connection = await createConnection({
        type: 'mysql', // 数据库类型
        host, // host
        port, // 端口
        username, // 用户名，root
        password, // 数据库密码
        database, // 连接哪个数据库
        entities: [User, UserAuth], // 对象 关于数据库的映射关系
        synchronize: false,
        logging: true, // 日志
      });

      return connection;
    })();
  }

  return connectionReadyPromise;
};

// yarn add @babel/core @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties babel-plugin-transform-typescript-metadata -D
