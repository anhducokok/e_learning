import React, { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Bar } from "react-chartjs-2";
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";
import DashboardHeader from "../../components/DashboardHeader";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { paymentService } from "../../services/paymentService";
import { courseService } from "../../services/courseService";
import { userService } from "../../services/userService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  price: number;
  transferContent: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const AdminPaymentApprovalPage: React.FC = () => {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [coursesMap, setCoursesMap] = useState<Record<string, string>>({});
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requests, courses, users] = await Promise.all([
        paymentService.getPendingPayments(),
        courseService.getAllCourses(),
        userService.getAllUsers(),
      ]);

      setCoursesMap(
        courses.reduce((acc, c) => {
          acc[c.id] = c.title;
          return acc;
        }, {} as Record<string, string>)
      );

      setUsersMap(
        users.reduce((acc, u) => {
          acc[u.id] = u.name;
          return acc;
        }, {} as Record<string, string>)
      );

      setPaymentRequests(requests);
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (request: PaymentRequest) => {
    const confirmed = confirm(
      "Bạn có chắc chắn muốn chấp nhận yêu cầu này? Người dùng sẽ được ghi danh vào khóa học."
    );
    if (!confirmed) return;

    try {
      // await courseService.enrollInCourse(request.courseId);
      await paymentService.approvePayment(request.id, request.userId, request.courseId);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Không thể chấp nhận yêu cầu");
    }
  };

  const handleReject = async (requestId: string) => {
    if (!confirm("Bạn có chắc chắn muốn từ chối yêu cầu này?")) return;
    try {
      await paymentService.rejectPayment(requestId);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Không thể từ chối yêu cầu");
    }
  };

  const stats = [
    {
      title: "Đang chờ",
      count: paymentRequests.filter((r) => r.status === "PENDING").length,
      color: "bg-yellow-500",
    },
    {
      title: "Đã duyệt",
      count: paymentRequests.filter((r) => r.status === "APPROVED").length,
      color: "bg-green-600",
    },
    {
      title: "Từ chối",
      count: paymentRequests.filter((r) => r.status === "REJECTED").length,
      color: "bg-red-600",
    },
  ];

  const courseCounts = paymentRequests.reduce((acc, r) => {
    const name = coursesMap[r.courseId] || "Không rõ";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = {
    labels: Object.keys(courseCounts),
    datasets: [
      {
        label: "Yêu cầu thanh toán",
        data: Object.values(courseCounts),
        backgroundColor: "#2563eb",
      },
    ],
  };

  // Thông báo cho admin  // const adminNotifications = [ // Unused variable
  //   {
  //     id: "1",
  //     title: "Yêu cầu mới",
  //     message: `${stats[0].count} yêu cầu thanh toán đang chờ duyệt`,
  //     time: "Vừa xong",
  //     type: "info",
  //     read: false,
  //   },
  // ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AdminLayout logoImage={logoImage} activePath="/admin-dashboard/payment">
      <main className="flex flex-col bg-gray-50 min-h-screen">
        <DashboardHeader title="Quản lý thanh toán" />
        <div className="p-6 space-y-10">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow hover:shadow-md transition">
                <div className={`${stat.color} p-4 text-white text-center font-semibold`}>
                  {stat.title}
                </div>
                <div className="bg-white text-center text-3xl font-bold py-4 text-gray-800">
                  {stat.count}
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Thống kê theo khóa học
            </h2>
            <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>

          {/* Payment Table */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Danh sách yêu cầu
            </h2>

            {error && (
              <div className="mb-4 text-red-700 bg-red-100 border border-red-400 px-4 py-2 rounded">
                {error}
              </div>
            )}

            {paymentRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckCircleIcon className="h-12 w-12 mx-auto mb-2" />
                Không có yêu cầu nào.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Người dùng</th>
                      <th className="px-4 py-2 text-left">Khóa học</th>
                      <th className="px-4 py-2 text-left">Giá</th>
                      <th className="px-4 py-2 text-left">Nội dung CK</th>
                      <th className="px-4 py-2 text-left">Trạng thái</th>
                      <th className="px-4 py-2 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paymentRequests.map((r) => (
                      <tr key={r.id}>
                        <td className="px-4 py-2">{usersMap[r.userId] || "Không rõ"}</td>
                        <td className="px-4 py-2">{coursesMap[r.courseId] || "Không rõ"}</td>
                        <td className="px-4 py-2">{r.price.toLocaleString()}₫</td>
                        <td className="px-4 py-2">{r.transferContent}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              r.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : r.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {r.status === "PENDING"
                              ? "Đang chờ"
                              : r.status === "APPROVED"
                              ? "Đã duyệt"
                              : "Đã từ chối"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right space-x-2">
                          {r.status === "PENDING" && (
                            <>
                              <button
                                title="Chấp nhận"
                                onClick={() => handleApprove(r)}
                                className="text-green-600 hover:text-green-800"
                              >
                                <CheckCircleIcon className="h-5 w-5" />
                              </button>
                              <button
                                title="Từ chối"
                                onClick={() => handleReject(r.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <XCircleIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminPaymentApprovalPage;
