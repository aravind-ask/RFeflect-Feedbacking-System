import { useState } from 'react';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Input } from './ui/input';
import { IFeedback } from '../interfaces/IFeedback';
import { useGetReceivedFeedbackQuery } from '../api/feedbackApi';

interface FeedbackSummaryTableProps {
  onViewDetails: (feedback: IFeedback) => void;
}

export const FeedbackSummaryTable: React.FC<FeedbackSummaryTableProps> = ({
  onViewDetails,
}) => {
  const { data: feedbackList = [], isLoading } = useGetReceivedFeedbackQuery();
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredFeedback = feedbackList.filter((feedback) =>
    dateFilter
      ? new Date(feedback.submittedAt).toLocaleDateString().includes(dateFilter)
      : true
  );

  const sortedFeedback = [...filteredFeedback].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
        : new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    }
    return sortOrder === 'asc'
      ? a.qualityScore - b.qualityScore
      : b.qualityScore - a.qualityScore;
  });

  const handleSort = (key: 'date' | 'score') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Input
          placeholder="Filter by date (e.g., MM/DD/YYYY)"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSort('date')}
              className="cursor-pointer"
            >
              Submitted At{' '}
              {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Provider</TableHead>
            <TableHead
              onClick={() => handleSort('score')}
              className="cursor-pointer"
            >
              Quality Score{' '}
              {sortBy === 'score' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>Loading...</TableCell>
            </TableRow>
          ) : sortedFeedback.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No feedback found</TableCell>
            </TableRow>
          ) : (
            sortedFeedback.map((feedback) => (
              <TableRow key={feedback._id}>
                <TableCell>
                  {new Date(feedback.submittedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {feedback.isAnonymous ? 'Anonymous' : feedback.providerId}
                </TableCell>
                <TableCell>{feedback.qualityScore}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(feedback)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
