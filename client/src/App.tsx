import { Provider } from 'react-redux';
import { store } from './store';
import { FeedbackRequestModal } from './components/FeedbackRequestModal';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackTrackingTable } from './components/FeedbackTrackingTable';
import { FeedbackSummaryTable } from './components/FeedbackSummaryTable';
import { FeedbackDetailModal } from './components/FeedbackDetailModal';
import { Toaster } from './components/ui/toaster';
import { useState } from 'react';
import { Button } from './components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { IFeedback } from './interfaces/IFeedback';

const mockForm = {
  _id: 'mock-form-id',
  fields: [
    { name: 'Comments', type: 'text', required: true },
    { name: 'Rating', type: 'rating', required: true },
    {
      name: 'Category',
      type: 'dropdown',
      options: ['Performance', 'Behavior'],
      required: false,
    },
  ],
  effectiveDate: new Date().toISOString(),
  createdBy: 'admin',
  tenantId: 'tenant1',
};

function App() {
  const [requestOpen, setRequestOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<IFeedback | null>(
    null
  );
  const [status, setStatus] = useState('Pending');
  const [view, setView] = useState<'tracking' | 'summary'>('tracking');

  const handleViewDetails = (feedback: IFeedback) => {
    setSelectedFeedback(feedback);
    setDetailOpen(true);
  };

  return (
    <Provider store={store}>
      <div className="p-4 space-y-4">
        <div className="flex space-x-4">
          <Button onClick={() => setRequestOpen(true)}>Request Feedback</Button>
          <Button onClick={() => setFormOpen(true)}>Provide Feedback</Button>
        </div>
        <div className="flex space-x-4">
          <Button
            variant={view === 'tracking' ? 'default' : 'outline'}
            onClick={() => setView('tracking')}
          >
            Track Requests
          </Button>
          <Button
            variant={view === 'summary' ? 'default' : 'outline'}
            onClick={() => setView('summary')}
          >
            View Feedback
          </Button>
        </div>
        {view === 'tracking' && (
          <>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {['Pending', 'Completed', 'Expired', 'Rejected'].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FeedbackTrackingTable status={status} />
          </>
        )}
        {view === 'summary' && (
          <FeedbackSummaryTable onViewDetails={handleViewDetails} />
        )}
        <FeedbackRequestModal
          open={requestOpen}
          onOpenChange={setRequestOpen}
        />
        <FeedbackForm
          open={formOpen}
          onOpenChange={setFormOpen}
          form={mockForm}
          receiverId="mock-receiver-id"
        />
        <FeedbackDetailModal
          open={detailOpen}
          onOpenChange={setDetailOpen}
          feedback={selectedFeedback}
        />
        <Toaster />
      </div>
    </Provider>
  );
}

export default App;
