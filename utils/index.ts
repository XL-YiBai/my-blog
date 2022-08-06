interface ICookieInfo {
  id: number;
  nickname: string;
  avatar: string;
}

// 设置cookie
export const setCookie = (
  cookies: any, // cookie的操作对象
  { id, nickname, avatar }: ICookieInfo // 要写入的cookie字段
) => {
  // 设置过期时间，也就是项目里面设置登录时效 24h
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  // cookie允许访问的path
  const path = '/';

  cookies.set('userId', id, {
    expires,
    path,
  });
  cookies.set('nickname', nickname, {
    expires,
    path,
  });
  cookies.set('avatar', avatar, {
    expires,
    path,
  });
};

// 清空cookie
export const clearCookie = (cookies: any) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';

  cookies.set('userId', '', {
    expires,
    path,
  });
  cookies.set('nickname', '', {
    expires,
    path,
  });
  cookies.set('avatar', '', {
    expires,
    path,
  });
};
