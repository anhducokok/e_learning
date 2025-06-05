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
  teacherID?: string;
  teacher?: User;
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
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
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
