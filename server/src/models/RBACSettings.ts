import { Schema, model } from 'mongoose';

export interface IRBACSettings {
  _id: string;
  tenantId: string;
  roles: {
    role: string;
    permissions: {
      viewFeedback: boolean;
      requestFeedback: boolean;
      giveFeedback: boolean;
      showProviderName: boolean;
      adminAccess: boolean;
    };
  }[];
  anonymousEnabled: boolean;
  recallTimeframe: number; // Hours
  requestLimits: {
    total: { count: number; days: number };
    perPerson: { count: number; days: number };
  };
}

const rbacSettingsSchema = new Schema<IRBACSettings>({
  tenantId: { type: String, required: true },
  roles: [
    {
      role: { type: String, required: true },
      permissions: {
        viewFeedback: { type: Boolean, default: false },
        requestFeedback: { type: Boolean, default: false },
        giveFeedback: { type: Boolean, default: false },
        showProviderName: { type: Boolean, default: false },
        adminAccess: { type: Boolean, default: false },
      },
    },
  ],
  anonymousEnabled: { type: Boolean, default: false },
  recallTimeframe: { type: Number, default: 24 },
  requestLimits: {
    total: {
      count: { type: Number, default: 50 },
      days: { type: Number, default: 30 },
    },
    perPerson: {
      count: { type: Number, default: 5 },
      days: { type: Number, default: 90 },
    },
  },
});

export const RBACSettings = model<IRBACSettings>(
  'RBACSettings',
  rbacSettingsSchema
);
