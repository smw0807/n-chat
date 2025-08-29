import { checkEmail as checkEmailApi, signup as signupApi } from '@/apis/user';
import useFetch from './useFetch';
import { SignupDto } from '@/models/user';

export default function useUser() {
  const { fetchData } = useFetch();

  const checkEmail = async (email: string) => {
    const res = await fetchData(`${checkEmailApi}?email=${email}`, 'GET');
    return res;
  };

  const signup = async (user: SignupDto) => {
    const res = await fetchData(`${signupApi}`, 'POST', user);
    if (res) {
      return true;
    }
    return false;
  };

  return { checkEmail, signup };
}
