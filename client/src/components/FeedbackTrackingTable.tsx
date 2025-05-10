import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { useToast } from '../hooks/use-toast';
import {
  useGetRequestsByStatusQuery,
  useSendReminderMutation,
} from '../api/feedbackApi';

interface FeedbackTrackingTableProps {
  status: string;
}

export const FeedbackTrackingTable: React.FC<FeedbackTrackingTableProps> = ({
  status,
}) => {
  const { toast } = useToast();
  const { data: requests = [], isLoading } = useGetRequestsByStatusQuery({
    status,
  });
  const [sendReminder, { isLoading: isSendingReminder }] =
    useSendReminderMutation();

  const handleReminder = async (requestId: string) => {
    try {
      await sendReminder({ requestId }).unwrap();
      toast({ title: 'Success', description: 'Reminder sent' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.data?.error?.message || 'Failed to send reminder',
        variant: 'destructive',
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Requestor</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Expected Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5}>Loading...</TableCell>
          </TableRow>
        ) : requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5}>No requests found</TableCell>
          </TableRow>
        ) : (
          requests.map((request) => (
            <TableRow key={request._id}>
              <TableCell>{request.requestorId}</TableCell>
              <TableCell>{request.providerId}</TableCell>
              <TableCell>{request.status}</TableCell>
              <TableCell>
                {new Date(request.expectedDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {request.status === 'Pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReminder(request._id)}
                    disabled={isSendingReminder}
                  >
                    {isSendingReminder ? 'Sending...' : 'Send Reminder'}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
