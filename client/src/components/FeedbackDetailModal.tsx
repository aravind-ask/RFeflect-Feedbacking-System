import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { IFeedback } from '../interfaces/IFeedback';

interface FeedbackDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: IFeedback | null;
}

export const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({
  open,
  onOpenChange,
  feedback,
}) => {
  if (!feedback) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Provider</h4>
            <p>{feedback.isAnonymous ? 'Anonymous' : feedback.providerId}</p>
          </div>
          <div>
            <h4 className="font-semibold">Submitted At</h4>
            <p>{new Date(feedback.submittedAt).toLocaleString()}</p>
          </div>
          <div>
            <h4 className="font-semibold">Quality Score</h4>
            <p>{feedback.qualityScore}/100</p>
          </div>
          <div>
            <h4 className="font-semibold">Responses</h4>
            {feedback.responses.map((response, index) => (
              <div key={index} className="mt-2">
                <p className="font-medium">{response.fieldName}</p>
                <p>{response.value.toString()}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
