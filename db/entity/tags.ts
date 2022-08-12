import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
// PrimaryGeneratedColumn 主键的列，，Column一般的列
import { User } from './user'
import { Article } from './article'

// 装饰器，name就是表名
@Entity({ name: 'tags' })
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;   // !: 在ts中是非必填的

  @Column()
  title!: string; // 标签名

  @Column()
  icon!: string; // 标签图标

  @Column()
  follow_count!: number; // 关注标签的人数

  @Column()
  article_count!: number; // 使用该标签的文章数

  @ManyToMany(() => User, { // 标签和用户是多对多的，一个用户可以关注多个标签，一个标签可以被多个用户关注
    cascade: true
  })
  @JoinTable({
    name: 'tags_users_rel',  // 关联表名称
    joinColumn: {
      name: 'tag_id'
    },
    inverseJoinColumn: {
      name: 'user_id'
    }
  })
  users!:User[]

  // 标签和文章是多对多的，一个文章可以添加标签，一个标签可以被多个文章使用
  @ManyToMany(() => Article, (article) => article.tags)
  @JoinTable({
    name: 'articles_tags_rel',  // 关联表名称
    joinColumn: {
      name: 'tag_id'
    },
    inverseJoinColumn: {
      name: 'article_id'
    }
  })
  articles!:Article[]
}
