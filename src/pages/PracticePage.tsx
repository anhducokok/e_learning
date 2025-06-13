import React, { useState } from 'react';
import type { PracticeAttempt, PracticeAnswer } from '../types/api';
import { practiceService } from '../services';
import PracticeList from '../components/practice/PracticeList';
import PracticeAttemptView from '../components/practice/PracticeAttempt';
import PracticeResults from '../components/practice/PracticeResults';

type ViewState = 'list' | 'attempt' | 'results';

interface PracticePageState {
  view: ViewState;
  selectedPracticeId: string | null;
  currentAttempt: PracticeAttempt | null;
  attemptAnswers: PracticeAnswer[] | null;
}

const PracticePage: React.FC = () => {
  const [state, setState] = useState<PracticePageState>({
    view: 'list',
    selectedPracticeId: null,
    currentAttempt: null,
    attemptAnswers: null
  });

  // Get user role (this would come from your auth context)
  const userRole = 'STUDENT'; // Replace with actual user role from context

  const handleStartPractice = (practiceId: string) => {
    setState(prev => ({
      ...prev,
      view: 'attempt',
      selectedPracticeId: practiceId,
      currentAttempt: null,
      attemptAnswers: null
    }));
  };

  const handlePracticeComplete = async (attempt: PracticeAttempt) => {
    try {
      // Fetch detailed answers if needed
      const answers = await practiceService.getPracticeAnswers(attempt.id);
      
      setState(prev => ({
        ...prev,
        view: 'results',
        currentAttempt: attempt,
        attemptAnswers: answers
      }));
    } catch (error) {
      // Still show results even if we can't get detailed answers
      setState(prev => ({
        ...prev,
        view: 'results',
        currentAttempt: attempt,
        attemptAnswers: []
      }));
    }
  };

  const handleExitPractice = () => {
    setState(prev => ({
      ...prev,
      view: 'list',
      selectedPracticeId: null,
      currentAttempt: null,
      attemptAnswers: null
    }));
  };

  const handleRetryPractice = () => {
    if (state.selectedPracticeId) {
      setState(prev => ({
        ...prev,
        view: 'attempt',
        currentAttempt: null,
        attemptAnswers: null
      }));
    }
  };

  const handleBackToList = () => {
    setState(prev => ({
      ...prev,
      view: 'list',
      selectedPracticeId: null,
      currentAttempt: null,
      attemptAnswers: null
    }));
  };

  const handleEditPractice = (practiceId: string) => {
    // Navigate to practice editor (to be implemented)
  };

  const handleDeletePractice = async (practiceId: string) => {
    if (window.confirm('Are you sure you want to delete this practice?')) {
      try {
        await practiceService.deletePractice(practiceId);
        // Refresh the list by staying on the same view
        // The PracticeList component will handle the refresh
      } catch (error) {
        alert('Failed to delete practice. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {state.view === 'list' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <PracticeList
            userRole={userRole}
            onStartPractice={handleStartPractice}
            onEditPractice={handleEditPractice}
            onDeletePractice={handleDeletePractice}
          />
        </div>
      )}      {state.view === 'attempt' && state.selectedPracticeId && (
        <PracticeAttemptView
          practiceId={state.selectedPracticeId}
          onComplete={handlePracticeComplete}
          onExit={handleExitPractice}
        />
      )}

      {state.view === 'results' && state.currentAttempt && (
        <PracticeResults
          attempt={state.currentAttempt}
          answers={state.attemptAnswers || []}
          onRetry={handleRetryPractice}
          onBackToList={handleBackToList}
        />
      )}
    </div>
  );
};

export default PracticePage;
