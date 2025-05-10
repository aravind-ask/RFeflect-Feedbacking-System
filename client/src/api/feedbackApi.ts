import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import { IFeedbackRequest } from '../interfaces/IFeedbackRequests';
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
        url: '/request',
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
        url: '/submit',
        method: 'POST',
        body,
      }),
    }),
    rejectFeedback: builder.mutation<
      void,
      { requestId: string; reason: string }
    >({
      query: (body) => ({
        url: '/reject',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useCreateRequestMutation,
  useSubmitFeedbackMutation,
  useRejectFeedbackMutation,
} = feedbackApi;
