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
import { useToast } from '../hooks/use-toast';
import { useGetUsersQuery } from '../api/userApi';
import { useCreateRequestMutation } from '../api/feedbackApi';

const schema = z.object({
  providerId: z.string().min(1, 'Please select a user'),
  message: z.string().min(1, 'Message is required'),
  expectedDate: z.string().min(1, 'Expected date is required'),
});

type FormData = z.infer<typeof schema>;

interface FeedbackRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeedbackRequestModal: React.FC<FeedbackRequestModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createRequest(data).unwrap();
      toast({ title: 'Success', description: 'Feedback request sent' });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.data?.error?.message || 'Failed to send request',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="providerId">Select User</Label>
            <Select
              onValueChange={(value) => setValue('providerId', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.providerId && (
              <p className="text-red-500 text-sm">
                {errors.providerId.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Input id="message" {...register('message')} />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="expectedDate">Expected Date</Label>
            <Input
              id="expectedDate"
              type="date"
              {...register('expectedDate')}
            />
            {errors.expectedDate && (
              <p className="text-red-500 text-sm">
                {errors.expectedDate.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Sending...' : 'Send Request'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
