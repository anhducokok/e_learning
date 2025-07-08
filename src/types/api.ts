// Practice module types
export type PracticeSkill = 'READING' | 'LISTENING' | 'GRAMMAR';
export type PracticeLevel = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
export type QuestionType = 'MCQ' | 'TRUE_FALSE'; // Match backend Prisma schema

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
  courses?: Course[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration?: string;
  image?: string;
  thumbnail?: string;
  price?: number;
  instructor?: User;
  enrollmentCount?: number;
  rating?: number;
  isPublished?: boolean;
  classId?: string;
  class?: Class;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  lessons?: Lesson[];
  teacherId?: string; // <-- match backend field
  teacher?: User;
  createdBy?: string; // Add the createdBy field for ownership
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Keep for backward compatibility
  textContent?: string; // Add new field
  order: number; // Keep for backward compatibility  
  orderIndex?: number; // Add new field
  duration?: string;
  videoUrl?: string;
  courseId: string;
  course?: Course;
  createdAt?: string;
  updatedAt?: string;
  quizzes?: Quiz[];
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  courseId?: string;
  lessonId?: string;
  course?: Course;
  lesson?: Lesson;
  questions?: QuizQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  quizId: string;
  quiz?: Quiz;
}

export interface QuestionAnswer {
  id: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  question?: QuizQuestion;
}

export interface QuizSubmission {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalPoints: number;
  maxPoints: number;
  answers: QuestionAnswer[];
  startedAt?: string;
  submittedAt?: string;
  timeSpent?: number;
  user?: User;
  quiz?: Quiz;
  createdAt?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: string;
  image?: string;
  price?: number;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

export interface CreateLessonRequest {
  title: string;
  textContent?: string;
  orderIndex: number;

  videoUrl?: string;
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {}

export interface CreateQuizRequest {
  title: string;
  description?: string;
  timeLimit?: number;
  courseId?: string;
  lessonId?: string;
  questions: {
    questionText: string;
    type: 'MCQ' | 'TRUE_FALSE';
    choices: string[];
    correctAnswer: string;
    explanation?: string;
    points?: number;
    orderIndex: number;
  }[];
}

export interface SubmitQuizRequest {
  answers: {
    questionId: string;
    selectedAnswer: string;
  }[];
}

// Schedule related types
export interface ClassSession {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  course: Course;
  instructorId: string;
  instructor: User;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  meetingLink?: string;
  maxStudents?: number;
  currentStudents?: number;
  enrolledStudents?: User[];
  location?: string;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleDay {
  date: string; // YYYY-MM-DD format
  sessions: ClassSession[];
}

export interface WeeklySchedule {
  weekStart: string; // ISO date string
  weekEnd: string; // ISO date string
  days: ScheduleDay[];
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName?: string;
  courseId: string;
  courseName?: string;
  price: number;
  transferContent: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}
export interface PracticeQuestion {
  id: string;
  question: string;
  questionType: QuestionType;
  options: string[];
  correctAnswer?: string;
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  points: number;
  orderIndex: number;
}

export interface Practice {
  id: string;
  title: string;
  description: string;
  skill: PracticeSkill;
  level: PracticeLevel;
  questionCount: number;
  timeLimit: number;
  createdAt: string;
  updatedAt: string;
  questions?: PracticeQuestion[];
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    questions: number;
    attempts: number;
  };
}

export interface PracticeAttempt {
  id: string;
  userId: string;
  practiceId: string;
  score: number;
  totalPoints: number;
  maxPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  startedAt: string;
  completedAt?: string;
  practice?: {
    id: string;
    title: string;
    skill: PracticeSkill;
    level: PracticeLevel;
    questionCount: number;
  };
}

export interface PracticeAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  question?: PracticeQuestion;
}

export interface CreatePracticeRequest {
  title: string;
  description: string;
  skill: PracticeSkill;
  level: PracticeLevel;
  questionCount: number;
  timeLimit: number;
  questions: CreatePracticeQuestionRequest[];
}

export interface CreatePracticeQuestionRequest {
  question: string;
  questionType: QuestionType;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  points?: number;
  orderIndex: number;
}

export interface SubmitPracticeRequest {
  timeSpent: number;
  answers: SubmitPracticeAnswerRequest[];
}

export interface SubmitPracticeAnswerRequest {
  questionId: string;
  selectedAnswer: string;
}

export interface PracticeStats {
  totalAttempts: number;
  completedAttempts: number;
  completionRate: number;
  averageScore: number;
  recentAttempts: PracticeAttempt[];
}

export interface StartPracticeResponse {
  attemptId: string;
  startedAt: string;
  practice: Practice;
}

export interface PracticeFilterRequest {
  skill?: PracticeSkill;
  level?: PracticeLevel;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
    instructor?: {
      name: string;
      email: string;
    };
  };
}

