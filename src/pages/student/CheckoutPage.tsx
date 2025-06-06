import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseService } from "../../services";
import type { Course } from "../../types/api";
import { useAuth } from "../../contexts/AuthContext";
import QR from "../../images/mb.jpg";

const CourseCheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, getRoleBasedRoute } = useAuth();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const course = await courseService.getCourseById(id);
        setCourse(course);
      } catch (err: any) {
        setError(err.message || "Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleConfirmPayment = () => {
    // Logic for confirming payment can be added here
    navigate("/payment-confirmation");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#A82828] border-opacity-75"></div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
            <p className="text-2xl text-red-600 font-semibold mb-6">{error}</p>
            <Link
              to="/courses"
              className="inline-block bg-[#A82828] text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Quay lại danh sách khóa học
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
            <p className="text-2xl text-red-600 font-semibold mb-6">Khóa học không tồn tại.</p>
            <Link
              to="/courses"
              className="inline-block bg-[#A82828] text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Quay lại danh sách khóa học
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="flex-grow max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight text-center">
            Thanh toán khóa học
          </h1>

          <div className="mb-8 bg-gray-50 rounded-xl p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Thông tin khóa học
            </h2>
            <div className="space-y-3">
              <p className="text-lg text-gray-700">
                <strong className="font-medium">Tên khóa học:</strong> {course.title}
              </p>
              <p className="text-lg text-gray-700">
                <strong className="font-medium">Giá:</strong>{" "}
                <span className="text-[#A82828] font-semibold">
                  {course.price?.toLocaleString("vi-VN") || "Liên hệ"} VNĐ
                </span>
              </p>
            </div>
          </div>

          {/* Bank Information and QR Code */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Thông tin chuyển khoản
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <p className="text-lg text-gray-700">
                  <strong className="font-medium">Tên chủ tài khoản:</strong> Trần Đình Dũng
                </p>
                <p className="text-lg text-gray-700">
                  <strong className="font-medium">Số tài khoản:</strong> 2566686868
                </p>
                <p className="text-lg text-gray-700">
                  <strong className="font-medium">Ngân hàng:</strong> MB Bank - Ngân hàng Quân đội Việt Nam
                </p>
                <p className="text-lg text-gray-700">
                  <strong className="font-medium">Nội dung chuyển khoản:</strong> {course.title} - {user?.name}
                </p>
              </div>
              <div className="flex-1 flex justify-center items-center">
                <img
                  src={QR}
                  alt="QR Code Thanh Toán"
                  className="w-64 h-64 object-contain rounded-3xl shadow-md border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = "../..//images/mb.jpg";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/course-success"
              className="flex-1 text-center bg-[#A82828] text-white px-6 py-4 rounded-lg font-semibold hover:bg-red-700 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-md"
            >
              Xác nhận chuyển khoản
            </Link>
            <Link
              to="/courses"
              className="flex-1 text-center bg-gray-200 text-gray-800 px-6 py-4 rounded-lg font-semibold hover:bg-gray-300 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-md"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseCheckoutPage;