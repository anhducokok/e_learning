-- Sample data for e_learning platform

-- Users
INSERT INTO users (id, name, email, password, role) VALUES
  ('1', 'Admin User', 'admin@example.com', 'hashedpassword1', 'ADMIN'),
  ('2', 'Teacher One', 'teacher1@example.com', 'hashedpassword2', 'TEACHER'),
  ('3', 'Student One', 'student1@example.com', 'hashedpassword3', 'STUDENT'),
  ('4', 'Student Two', 'student2@example.com', 'hashedpassword4', 'STUDENT');

-- Courses
INSERT INTO courses (id, title, description, image, price, teacher_id) VALUES
  ('c1', 'Basic Chinese', 'Learn basic Chinese language skills.', 'https://plus.unsplash.com/premium_photo-1661600619578-2d9e2593bbfc?w=500&auto=format&fit=crop&q=60', 1000000, '2'),
  ('c2', 'Advanced Chinese', 'Advanced topics in Chinese.', 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=500&auto=format&fit=crop&q=60', 1500000, '2');

-- Enrollments
INSERT INTO enrollments (id, user_id, course_id, enrolled_at) VALUES
  ('e1', '3', 'c1', '2025-07-01'),
  ('e2', '4', 'c1', '2025-07-02'),
  ('e3', '3', 'c2', '2025-07-03');

-- Payments
INSERT INTO payments (id, user_id, course_id, amount, status, paid_at) VALUES
  ('p1', '3', 'c1', 1000000, 'PAID', '2025-07-01'),
  ('p2', '4', 'c1', 1000000, 'PAID', '2025-07-02'),
  ('p3', '3', 'c2', 1500000, 'PAID', '2025-07-03');

-- Lessons
INSERT INTO lessons (id, course_id, title, content, video_url) VALUES
  ('l1', 'c1', 'Introduction', 'Welcome to Basic Chinese!', 'https://www.youtube.com/embed/abc123'),
  ('l2', 'c1', 'Lesson 1', 'First lesson content.', 'https://www.youtube.com/embed/def456'),
  ('l3', 'c2', 'Advanced Lesson', 'Advanced content.', 'https://www.youtube.com/embed/ghi789');

-- Quizzes
INSERT INTO quizzes (id, course_id, title) VALUES
  ('q1', 'c1', 'Quiz 1'),
  ('q2', 'c2', 'Quiz 2');

-- Questions
INSERT INTO questions (id, quiz_id, question_text, correct_answer) VALUES
  ('qst1', 'q1', 'What is "hello" in Chinese?', '你好'),
  ('qst2', 'q2', 'Translate "advanced" to Chinese.', '高级');

-- Answers
INSERT INTO answers (id, question_id, user_id, answer_text, is_correct) VALUES
  ('a1', 'qst1', '3', '你好', 1),
  ('a2', 'qst2', '3', '高级', 1);
