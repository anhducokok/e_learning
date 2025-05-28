export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  image?: string;
  price?: number;
  instructor?: User;
  enrollmentCount?: number;
  rating?: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
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

export interface QuizSubmission {
  id: string;
  answers: number[];
  score?: number;
  userId: string;
  quizId: string;
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
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  image?: string;
  price?: number;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

export interface CreateLessonRequest {
  title: string;
  content: string;
  order: number;
  duration?: string;
  videoUrl?: string;
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {}

export interface CreateQuizRequest {
  title: string;
  description?: string;
  courseId?: string;
  lessonId?: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface SubmitQuizRequest {
  answers: number[];
}
