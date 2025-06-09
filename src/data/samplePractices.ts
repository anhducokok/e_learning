import type { Practice } from '../types/api';

export const samplePractices: Practice[] = [
  {
    id: '1',
    title: 'HSK Level 1 Vocabulary',
    description: 'Test your knowledge of basic Chinese vocabulary with this comprehensive practice session.',
    skill: 'READING',
    level: 'BASIC',
    questionCount: 20,
    timeLimit: 1200, // 20 minutes
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2025-06-01T10:00:00Z',
    creator: {
      id: 'teacher1',
      name: '王老师',
      email: 'wang.teacher@example.com'
    },
    _count: {
      questions: 20,
      attempts: 45
    }
  },
  {
    id: '2',
    title: 'Chinese Listening Comprehension',
    description: 'Practice your listening skills with authentic Chinese conversations and dialogues.',
    skill: 'LISTENING',
    level: 'INTERMEDIATE',
    questionCount: 15,
    timeLimit: 1800, // 30 minutes
    createdAt: '2025-06-02T14:30:00Z',
    updatedAt: '2025-06-02T14:30:00Z',
    creator: {
      id: 'teacher2',
      name: '李老师',
      email: 'li.teacher@example.com'
    },
    _count: {
      questions: 15,
      attempts: 32
    }
  },
  {
    id: '3',
    title: 'Advanced Grammar Patterns',
    description: 'Master complex Chinese grammar structures and sentence patterns.',
    skill: 'GRAMMAR',
    level: 'ADVANCED',
    questionCount: 25,
    timeLimit: 2400, // 40 minutes
    createdAt: '2025-06-03T09:15:00Z',
    updatedAt: '2025-06-03T09:15:00Z',
    creator: {
      id: 'teacher1',
      name: '王老师',
      email: 'wang.teacher@example.com'
    },
    _count: {
      questions: 25,
      attempts: 18
    }
  },
  {
    id: '4',
    title: 'Daily Chinese Conversations',
    description: 'Practice common phrases and expressions used in everyday Chinese conversations.',
    skill: 'READING',
    level: 'BASIC',
    questionCount: 12,
    timeLimit: 900, // 15 minutes
    createdAt: '2025-06-04T16:45:00Z',
    updatedAt: '2025-06-04T16:45:00Z',
    creator: {
      id: 'teacher3',
      name: '张老师',
      email: 'zhang.teacher@example.com'
    },
    _count: {
      questions: 12,
      attempts: 67
    }
  },
  {
    id: '5',
    title: 'Business Chinese Listening',
    description: 'Improve your professional Chinese listening skills with business scenarios.',
    skill: 'LISTENING',
    level: 'ADVANCED',
    questionCount: 18,
    timeLimit: 2100, // 35 minutes
    createdAt: '2025-06-05T11:20:00Z',
    updatedAt: '2025-06-05T11:20:00Z',
    creator: {
      id: 'teacher2',
      name: '李老师',
      email: 'li.teacher@example.com'
    },
    _count: {
      questions: 18,
      attempts: 23
    }
  },
  {
    id: '6',
    title: 'Chinese Character Recognition',
    description: 'Test your ability to recognize and understand Chinese characters in context.',
    skill: 'READING',
    level: 'INTERMEDIATE',
    questionCount: 30,
    timeLimit: 1800, // 30 minutes
    createdAt: '2025-06-06T13:10:00Z',
    updatedAt: '2025-06-06T13:10:00Z',
    creator: {
      id: 'teacher3',
      name: '张老师',
      email: 'zhang.teacher@example.com'
    },
    _count: {
      questions: 30,
      attempts: 41
    }
  }
];

export const sampleQuestions = [
  {
    id: 'q1',
    question: '你好 (nǐ hǎo) means:',
    questionType: 'MULTIPLE_CHOICE' as const,
    options: ['Goodbye', 'Hello', 'Thank you', 'Excuse me'],
    correctAnswer: 'Hello',
    explanation: '你好 (nǐ hǎo) is the most common greeting in Chinese, meaning "hello" or "hi".',
    points: 5,
    orderIndex: 0
  },
  {
    id: 'q2',
    question: 'Which character means "water"?',
    questionType: 'MULTIPLE_CHOICE' as const,
    options: ['火', '水', '土', '风'],
    correctAnswer: '水',
    explanation: '水 (shuǐ) is the Chinese character for water. It represents one of the five elements.',
    points: 5,
    orderIndex: 1
  },
  {
    id: 'q3',
    question: 'The sentence "我是学生" means "I am a student".',
    questionType: 'TRUE_FALSE' as const,
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: '我 (wǒ) means "I", 是 (shì) means "am/is/are", and 学生 (xuéshēng) means "student".',
    points: 3,
    orderIndex: 2
  }
];
