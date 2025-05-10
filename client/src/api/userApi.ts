import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import { IUser } from '../interfaces/IUser';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      query: () => '/',
    }),
  }),
});

export const { useGetUsersQuery } = userApi;
