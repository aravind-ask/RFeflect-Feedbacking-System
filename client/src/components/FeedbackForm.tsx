import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { useToast } from '../hooks/use-toast';
import { IFeedbackForm } from '../interfaces/IFeedbackForm';
import {
  useSubmitFeedbackMutation,
  useRejectFeedbackMutation,
} from '../api/feedbackApi';

interface FeedbackFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: IFeedbackForm;
  requestId?: string;
  receiverId: string;
}

const schema = z.object({
  responses: z.array(z.object({ fieldName: z.string(), value: z.any() })),
  isAnonymous: z.boolean(),
  rejectReason: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  open,
  onOpenChange,
  form,
  requestId,
  receiverId,
}) => {
  const { toast } = useToast();
  const [submitFeedback, { isLoading: isSubmitting }] =
    useSubmitFeedbackMutation();
  const [rejectFeedback, { isLoading: isRejecting }] =
    useRejectFeedbackMutation();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      responses: form.fields.map((field) => ({
        fieldName: field.name,
        value: '',
      })),
      isAnonymous: false,
    },
  });

  const responses = watch('responses');
  const [qualityScore, setQualityScore] = useState(0);

  useEffect(() => {
    let score = 0;
    responses.forEach((res) => {
      if (typeof res.value === 'string' && res.value.length > 50) score += 30;
      if (typeof res.value === 'number' && res.value >= 4) score += 20;
      if (
        typeof res.value === 'string' &&
        res.value.toLowerCase().includes('excellent')
      )
        score += 50;
    });
    setQualityScore(Math.min(score, 100));
  }, [responses]);

  const onSubmit = async (data: FormData) => {
    if (data.rejectReason) {
      try {
        await rejectFeedback({
          requestId: requestId!,
          reason: data.rejectReason,
        }).unwrap();
        toast({ title: 'Success', description: 'Feedback request rejected' });
        onOpenChange(false);
      } catch (error: any) {
        toast({
          title: 'Error',
          description:
            error.data?.error?.message || 'Failed to reject feedback',
          variant: 'destructive',
        });
      }
      return;
    }

    try {
      await submitFeedback({
        requestId,
        receiverId,
        formId: form._id,
        responses: data.responses,
        isAnonymous: data.isAnonymous,
      }).unwrap();
      toast({ title: 'Success', description: 'Feedback submitted' });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.data?.error?.message || 'Failed to submit feedback',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {form.fields.map((field, index) => (
            <div key={field.name}>
              <Label htmlFor={field.name}>{field.name}</Label>
              {field.type === 'text' && (
                <Input
                  id={field.name}
                  {...register(`responses.${index}.value`)}
                  onChange={(e) =>
                    setValue(`responses.${index}.value`, e.target.value)
                  }
                />
              )}
              {field.type === 'rating' && (
                <Select
                  onValueChange={(value) =>
                    setValue(`responses.${index}.value`, parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {field.type === 'dropdown' && (
                <Select
                  onValueChange={(value) =>
                    setValue(`responses.${index}.value`, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.responses?.[index]?.value && (
                <p className="text-red-500 text-sm">This field is required</p>
              )}
            </div>
          ))}
          <div>
            <Label>Quality Score</Label>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-green-500 rounded"
                style={{ width: `${qualityScore}%` }}
              />
            </div>
            <p>{qualityScore}/100</p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={watch('isAnonymous')}
              onCheckedChange={(checked) => setValue('isAnonymous', checked)}
            />
            <Label htmlFor="anonymous">Submit Anonymously</Label>
          </div>
          {requestId && (
            <div>
              <Label htmlFor="rejectReason">Reject Reason (Optional)</Label>
              <Input id="rejectReason" {...register('rejectReason')} />
            </div>
          )}
          <Button type="submit" disabled={isSubmitting || isRejecting}>
            {isSubmitting || isRejecting ? 'Processing...' : 'Submit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
