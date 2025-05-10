import { Provider } from 'react-redux';
import { store } from './store';
import { FeedbackRequestModal } from './components/FeedbackRequestModal';
import { FeedbackForm } from './components/FeedbackForm';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/toaster';
import { useState } from 'react';

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

  return (
    <Provider store={store}>
      <div className="p-4 space-y-4">
        <Button onClick={() => setRequestOpen(true)}>Request Feedback</Button>
        <Button onClick={() => setFormOpen(true)}>Provide Feedback</Button>
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
        <Toaster />
      </div>
    </Provider>
  );
}

export default App;
