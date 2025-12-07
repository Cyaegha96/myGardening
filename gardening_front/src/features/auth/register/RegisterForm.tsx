
import useRegisterModel from './useRegisterModel';
import RegisterFormView from './RegisterFormView';

export default function RegisterForm() {
  const model = useRegisterModel();

  return (
    <RegisterFormView
        emailValid={false} {...model}    />
  );
}
