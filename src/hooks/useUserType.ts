// src/hooks/useUserType.ts
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { userTypes } from '@/constants/userTypes';
import type { TUserType } from '@/types';

export const useUserType = (): {
  userType: TUserType | undefined;
  isLoading: boolean;
  redirectToDashboard: () => void;
} => {
  const { data: userData, isLoading } = useUserInfoQuery(undefined);
  
  const redirectToDashboard = () => {
    if (!isLoading && userData?.data?.userType) {
      switch (userData.data.userType) {
        case userTypes.ADMIN:
          return '/admin';
        case userTypes.SENDER:
          return '/sender';
        case userTypes.RECEIVER:
          return '/receiver';
        default:
          return '/unauthorized';
      }
    }
    return null;
  };

  return {
    userType: userData?.data?.userType,
    isLoading,
    redirectToDashboard,
  };
};