// src/hooks/useAuth.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';

const AUTH_QUERY_KEY = 'auth';

export const initializeAuth = () => {
  const token = localStorage.getItem('_UPLFMMATRIX');
  const user = localStorage.getItem('user');
  const fakeToken = localStorage.getItem('_GBLFMATRIX');
  const secretKey = localStorage.getItem('_TFDSFUMATRIX');
  const validationKey = localStorage.getItem('_WBMJEBUJPMMATRIX');
  return token && user && fakeToken && secretKey && validationKey
    ? { token, user: JSON.parse(user), fakeToken, secretKey, validationKey }
    : null;
};

export const useAuth = () => {
  return useQuery({
    queryKey: [AUTH_QUERY_KEY],
    queryFn: () => initializeAuth(),
    staleTime: Infinity,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    localStorage.clear();
    window.location.reload();
    queryClient.removeQueries({ queryKey: [AUTH_QUERY_KEY] });
  };
};
