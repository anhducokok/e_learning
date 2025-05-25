export interface CourseSection {
  title: string;
  lectures: {
    title: string;
    duration: string;
  }[];
  totalTime: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  lastUpdated: string;
  price: number;
  salePrice: number;
  hoursOfVideo: number;
  articles: number;
  resources: number;
  sections: number;
  lectures: number;
  totalLength: string;
  level: string;
  languages: string[];
  thumbnail: string;
  whatYouWillLearn: string[];
  curriculum: CourseSection[];
  requirements: string[];
  longDescription: string[];
  targetAudience: string[];
}

export const coursesData: Course[] = [
  {
    id: 1,
    title: 'Build Text to Image SaaS App in React JS',
    description: 'Master AI-driven text-to-image SaaS from scratch! Build a Text to Image SaaS App using React JS, Node.js & Stripe Payment!',
    instructor: 'Nguyen Van A',
    rating: 4.7,
    reviewCount: 137,
    studentCount: 577,
    lastUpdated: 'April 2023',
    price: 109.99,
    salePrice: 19.99,
    hoursOfVideo: 26,
    articles: 12,
    resources: 5,
    sections: 8,
    lectures: 22,
    totalLength: '6h 30m',
    level: 'All Levels',
    languages: ['English', 'Vietnamese'],
    thumbnail: '/images/text-to-image.jpg',
    whatYouWillLearn: [
      'Complete course with step-by-step guidance',
      'Build a fully functional text-to-image app',
      'Integrate Stripe for payment processing',
      'Master React.js fundamentals',
      'Learn Node.js for backend development',
      'Understand modern UI/UX principles'
    ],
    requirements: [
      'Basic knowledge of React.js is recommended',
      'Basic understanding of JavaScript and ES6 features',
      'No prior experience with Node.js or payment processing is required'
    ],
    longDescription: [
      'This has been the most comprehensive course on building specific image generation SaaS applications with React JS, Node.js, and Stripe Payment!',
      'Whether you\'re a developer looking to expand your portfolio, an entrepreneur seeking to create the next big SaaS product, or simply curious about combining AI with web development, this course is designed with you in mind.',
      'Throughout this course, we\'ll build a complete text-to-image SaaS application from scratch. You\'ll learn how to:',
      'By the end of this course, you\'ll have a fully functional SaaS application that you can showcase in your portfolio or even launch as a real business!'
    ],
    targetAudience: [
      'React developers looking to expand their skills',
      'Web developers interested in SaaS application development',
      'Entrepreneurs wanting to create text-to-image SaaS products',
      'Anyone interested in AI integration with web applications'
    ],
    curriculum: [
      {
        title: 'Project Introduction',
        lectures: [
          { title: 'App Overview - Build Text to Image SaaS', duration: '11 min' },
          { title: 'About This Course', duration: '9 min' },
          { title: 'Course Structure & Expectations', duration: '7 min' }
        ],
        totalTime: '27 min'
      },
      {
        title: 'Project Setup and Configuration',
        lectures: [
          { title: 'Environment Setup & Dependencies', duration: '15 min' },
          { title: 'Workspace setup & VS Code', duration: '8 min' },
          { title: 'React Project Initialization', duration: '12 min' }
        ],
        totalTime: '35 min'
      },
      {
        title: 'Frontend Development',
        lectures: [
          { title: 'Creating the User Interface', duration: '20 min' },
          { title: 'Image Generation Form Components', duration: '25 min' },
          { title: 'Responsive Design Implementation', duration: '15 min' }
        ],
        totalTime: '60 min'
      },
      {
        title: 'Payment Integration',
        lectures: [
          { title: 'Stripe API Integration', duration: '30 min' },
          { title: 'Payment Flow Implementation', duration: '25 min' },
          { title: 'Testing Payment Functionality', duration: '20 min' }
        ],
        totalTime: '75 min'
      }
    ]
  },
  {
    id: 2,
    title: 'Advanced Machine Learning & Data Analysis',
    description: 'Learn cutting-edge machine learning algorithms and data analysis techniques with Python and TensorFlow',
    instructor: 'Tran Thi B',
    rating: 4.8,
    reviewCount: 219,
    studentCount: 843,
    lastUpdated: 'June 2023',
    price: 129.99,
    salePrice: 24.99,
    hoursOfVideo: 32,
    articles: 18,
    resources: 8,
    sections: 10,
    lectures: 45,
    totalLength: '9h 15m',
    level: 'Advanced',
    languages: ['English', 'Vietnamese'],
    thumbnail: '/images/machine-learning.jpg',
    whatYouWillLearn: [
      'Master advanced machine learning algorithms',
      'Build neural networks with TensorFlow and Keras',
      'Perform complex data analysis and visualization',
      'Deploy machine learning models to production',
      'Work with real-world datasets',
      'Implement natural language processing techniques'
    ],
    requirements: [
      'Basic knowledge of Python programming',
      'Understanding of basic statistics and linear algebra',
      'Familiarity with data science concepts'
    ],
    longDescription: [
      'This comprehensive course covers the most advanced machine learning and data analysis techniques used in industry today.',
      'You\'ll learn how to build, train, and deploy sophisticated machine learning models using Python, TensorFlow, and other cutting-edge tools.',
      'The course includes hands-on projects with real-world datasets, allowing you to apply your skills to solve complex problems.',
      'By the end of this course, you\'ll have the skills to work as a machine learning engineer or data scientist in leading tech companies.'
    ],
    targetAudience: [
      'Data analysts looking to advance to machine learning',
      'Software engineers interested in AI and ML',
      'Researchers needing to apply ML to their field',
      'Anyone wanting to master advanced data science techniques'
    ],
    curriculum: [
      {
        title: 'Introduction to Advanced ML',
        lectures: [
          { title: 'Course Overview and ML Landscape', duration: '14 min' },
          { title: 'Setting Up Your Environment', duration: '20 min' },
          { title: 'Review of ML Fundamentals', duration: '25 min' }
        ],
        totalTime: '59 min'
      },
      {
        title: 'Neural Networks Deep Dive',
        lectures: [
          { title: 'Neural Network Architectures', duration: '28 min' },
          { title: 'Backpropagation and Optimization', duration: '32 min' },
          { title: 'Building Your First Neural Network', duration: '45 min' }
        ],
        totalTime: '105 min'
      },
      {
        title: 'Advanced TensorFlow',
        lectures: [
          { title: 'TensorFlow 2.0 Features', duration: '22 min' },
          { title: 'Custom Training Loops', duration: '27 min' },
          { title: 'Model Deployment Strategies', duration: '31 min' }
        ],
        totalTime: '80 min'
      }
    ]
  }
];

export const getCourseById = (id: number): Course | undefined => {
  return coursesData.find(course => course.id === id);
};
