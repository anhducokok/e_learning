export interface EnrolledStudent {
  id: string;
  name: string;
  email: string;
  course: {
    id: string;
    title: string;
  };
  enrolledAt: string;
}
