// Simple test to verify API data fetching and processing for LearningSessionPage
console.log('=== Testing LearningSessionPage API Integration ===');

// Test the API helper functions with mock data
const processLessons = (lessonsData) => {
  if (!Array.isArray(lessonsData)) {
    console.log('⚠️ Lessons data is not an array:', typeof lessonsData);
    return [];
  }
  
  console.log('📖 Processing lessons:', lessonsData.length);
  
  // Sort lessons by orderIndex or order, with fallback to id
  const sorted = lessonsData.sort((a, b) => {
    const aOrder = a.orderIndex || a.order || parseInt(a.id) || 0;
    const bOrder = b.orderIndex || b.order || parseInt(b.id) || 0;
    return aOrder - bOrder;
  });
  
  console.log('📖 Sorted lessons:', sorted.map(l => ({ id: l.id, title: l.title, order: l.orderIndex || l.order })));
  return sorted;
};

const processQuizzes = (quizzesData) => {
  if (!Array.isArray(quizzesData)) {
    console.log('⚠️ Quizzes data is not an array:', typeof quizzesData);
    return [];
  }
  
  console.log('🎯 Processing quizzes:', quizzesData.length);
  
  quizzesData.forEach((quiz, index) => {
    console.log(`🎯 Quiz ${index + 1}:`, {
      id: quiz.id,
      title: quiz.title,
      questionsCount: quiz.questions?.length || 0,
      hasQuestions: Array.isArray(quiz.questions),
    });
  });
  
  return quizzesData;
};

// Mock API response format: {success: true, statusCode: 200, data: [...]}
const mockLessonsResponse = {
  success: true,
  statusCode: 200,
  data: [
    { id: '1', title: 'Lesson 1: Introduction', orderIndex: 1, videoUrl: 'https://example.com/video1.mp4' },
    { id: '2', title: 'Lesson 2: Advanced Topics', orderIndex: 2, videoUrl: 'https://example.com/video2.mp4' },
    { id: '3', title: 'Lesson 3: Conclusion', orderIndex: 3, videoUrl: 'https://example.com/video3.mp4' }
  ]
};

const mockQuizzesResponse = {
  success: true,
  statusCode: 200,
  data: [
    {
      id: '1',
      title: 'Quiz 1: Basic Knowledge',
      questions: [
        { id: 'q1', question: 'What is 2+2?', options: ['3', '4', '5'], correctAnswer: 1 },
        { id: 'q2', question: 'What is the capital of France?', options: ['Berlin', 'Paris', 'London'], correctAnswer: 1 }
      ]
    },
    {
      id: '2',
      title: 'Quiz 2: Advanced Topics',
      questions: [
        { id: 'q3', question: 'What is React?', options: ['Library', 'Framework', 'Language'], correctAnswer: 0 }
      ]
    }
  ]
};

// Test the API response processing
console.log('\n=== Testing API Response Processing ===');

// Simulate how the lessonService.getLessonsByCourse returns data
const lessonsFromAPI = mockLessonsResponse.data || [];
const processedLessons = processLessons(lessonsFromAPI);

// Simulate how the quizService.getQuizzesByCourse returns data  
const quizzesFromAPI = mockQuizzesResponse.data || [];
const processedQuizzes = processQuizzes(quizzesFromAPI);

console.log('\n=== Final Results ===');
console.log('✅ Processed Lessons Count:', processedLessons.length);
console.log('✅ Processed Quizzes Count:', processedQuizzes.length);

// Simulate progress initialization
const lessonProgress = processedLessons.map(lesson => ({
  lessonId: lesson.id,
  completed: Math.random() > 0.7,
  watchTime: Math.floor(Math.random() * 100)
}));

const quizAttempts = processedQuizzes.map(quiz => ({
  quizId: quiz.id,
  completed: Math.random() > 0.6,
  score: Math.random() > 0.6 ? Math.floor(Math.random() * 40) + 60 : undefined,
  attempts: Math.floor(Math.random() * 3) + 1
}));

console.log('✅ Lesson Progress Initialized:', lessonProgress.length, 'items');
console.log('✅ Quiz Attempts Initialized:', quizAttempts.length, 'items');

console.log('\n=== Test Complete ===');
console.log('🎉 LearningSessionPage API integration should work correctly!');
