import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
// PrimaryGeneratedColumn 主键的列，，Column一般的列

// 装饰器，name就是表名
@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;   // !: 在ts中是非必填的

  @Column()
  nickname!: string;

  @Column()
  avatar!: string;

  @Column()
  job!: string;

  @Column()
  introduce!: string;
}
