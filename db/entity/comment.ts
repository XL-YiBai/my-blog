import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user'
import { Article } from './article' 
// PrimaryGeneratedColumn 主键的列，，Column一般的列

// 装饰器，name就是表名
@Entity({ name: 'comments' })
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;   // !: 在ts中是非必填的

  @Column()
  content!: string;

  @Column()
  create_time!: Date; // 创建时间

  @Column()
  update_time!: Date; // 更新时间

  @ManyToOne(() => User) // 一个用户可以发布多条评论
  @JoinColumn({name: 'user_id'}) // 外键键名
  user!:User

  @ManyToOne(() => Article) // 一篇文章可以有多条评论
  @JoinColumn({name: 'article_id'})
  article!: Article
}
