import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// PrimaryGeneratedColumn 主键的列，，Column一般的列
import { User } from './user'

// 装饰器，name就是表名
@Entity({ name: 'user_auths' })
export class UserAuth extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;   // !: 在ts中是非必填的

  @Column()
  identity_type!: string;

  @Column()
  identifier!: string;

  @Column()
  credential!: string;

  @ManyToOne(() => User, {  // 和User表关联，并且一个user可以对应多个三方登录，所以这里是ManyToOne
    cascade: true // 设置保存的时候，把相应的级联关系自动保存
  })
  @JoinColumn({name: 'user_id'}) // 外键的名字
  user!: User // 关联User
}
