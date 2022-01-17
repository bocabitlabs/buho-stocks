import { useMutation } from "react-query";
import axios from "axios";

interface LoginMutationProps {
  username: string;
  password: string;
}

interface RegisterMutationProps {
  username: string;
  password: string;
  password2: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const useLoginUser = (options = {}) => {
  return useMutation(
    (props: LoginMutationProps) => axios.post(`/auth/api-token-auth/`, props),
    options,
  );
};

export const useRegisterUser = (options = {}) => {
  return useMutation(
    (props: RegisterMutationProps) => axios.post(`/auth/register/`, props),
    options,
  );
};

export default useLoginUser;
