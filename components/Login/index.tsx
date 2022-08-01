interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  console.log(props);

  return <div>登陆弹框</div>;
};

export default Login;
