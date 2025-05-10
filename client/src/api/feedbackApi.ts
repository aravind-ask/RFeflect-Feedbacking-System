import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import { IFeedbackRequest } from '../interfaces/IFeedbackRequest';
import { IFeedback } from '../interfaces/IFeedback';

export const feedbackApi = createApi({
  reducerPath: 'feedbackApi',
  baseQuery,
  endpoints: (builder) => ({
    createRequest: builder.mutation<
      IFeedbackRequest,
      { providerId: string; message: string; expectedDate: string }
    >({
      query: (body) => ({
        url: '/feedback/request',
        method: 'POST',
        body,
      }),
    }),
    submitFeedback: builder.mutation<
      IFeedback,
      {
        requestId?: string;
        receiverId: string;
        formId: string;
        responses: { fieldName: string; value: any }[];
        isAnonymous: boolean;
      }
    >({
      query: (body) => ({
        url: '/feedback/submit',
        method: 'POST',
        body,
      }),
    }),
    rejectFeedback: builder.mutation<
      void,
      { requestId: string; reason: string }
    >({
      query: (body) => ({
        url: '/feedback/reject',
        method: 'POST',
        body,
      }),
    }),
    getRequestsByStatus: builder.query<IFeedbackRequest[], { status: string }>({
      query: ({ status }) => ({
        url: '/feedback/requests',
        params: { status },
      }),
    }),
    sendReminder: builder.mutation<void, { requestId: string }>({
      query: (body) => ({
        url: '/feedback/reminder',
        method: 'POST',
        body,
      }),
    }),
    getReceivedFeedback: builder.query<IFeedback[], void>({
      query: () => '/feedback/received',
    }),
  }),
});

export const {
  useCreateRequestMutation,
  useSubmitFeedbackMutation,
  useRejectFeedbackMutation,
  useGetRequestsByStatusQuery,
  useSendReminderMutation,
  useGetReceivedFeedbackQuery,
} = feedbackApi;
