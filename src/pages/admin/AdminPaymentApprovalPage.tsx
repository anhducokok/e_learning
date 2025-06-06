// import React, { useState, useEffect } from "react";
// import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
// import { paymentService } from "../../services/paymentService";
// import DashboardHeader from "../../components/DashboardHeader";
// import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg";
// import TeacherLayout from "../../components/teacher/TeacherLayout";

// interface PaymentRequest {
//   id: string;
//   username: string;
//   courseId: string;
//   courseName: string;
//   price: number;
//   transferContent: string;
//   status: "PENDING" | "APPROVED" | "REJECTED";
// }

// const AdminPaymentApprovalPage: React.FC = () => {
//   const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Lấy danh sách yêu cầu thanh toán khi component được mount
//   useEffect(() => {
//     fetchPaymentRequests();
//   }, []);

//   const fetchPaymentRequests = async () => {
//     try {
//       setLoading(true);
//       const requests = await paymentService.getPendingPayments();
//       setPaymentRequests(requests);
//     } catch (err: any) {
//       setError(err.message || "Không thể tải danh sách yêu cầu thanh toán");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Xử lý chấp nhận yêu cầu thanh toán
//   const handleApprovePayment = async (requestId: string, courseId: string, username: string) => {
//     if (!confirm("Bạn có chắc chắn muốn chấp nhận yêu cầu này? Người dùng sẽ được ghi danh vào khóa học.")) return;

//     try {
//       await paymentService.approvePayment(requestId, username, courseId);
//       fetchPaymentRequests(); // Làm mới danh sách sau khi chấp nhận
//     } catch (err: any) {
//       setError(err.message || "Không thể chấp nhận yêu cầu");
//     }
//   };

//   // Xử lý từ chối yêu cầu thanh toán
//   const handleRejectPayment = async (requestId: string) => {
//     if (!confirm("Bạn có chắc chắn muốn từ chối yêu cầu này?")) return;

//     try {
//       await paymentService.rejectPayment(requestId);
//       fetchPaymentRequests(); // Làm mới danh sách sau khi từ chối
//     } catch (err: any) {
//       setError(err.message || "Không thể từ chối yêu cầu");
//     }
//   };

//   // Thông báo cho admin
//   const adminNotifications = [
//     {
//       id: "1",
//       title: "Quản lý thanh toán",
//       message: "Chào mừng đến với trang quản lý yêu cầu thanh toán",
//       time: "Bây giờ",
//       type: "info" as const,
//       read: false,
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
//       </div>
//     );
//   }

//   return (
//     <TeacherLayout logoImage={logoImage} activePath="/admin/payments">
//       <div className="flex min-h-screen bg-gray-50">
//         <main className="flex-1 flex flex-col">
//           <DashboardHeader
//             title="Quản lý yêu cầu thanh toán"
//             notifications={adminNotifications}
//           />

//           <div className="flex-1 p-8">
//             {error && (
//               <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                 {error}
//               </div>
//             )}

//             {/* Tiêu đề */}
//             <h1 className="text-2xl font-bold text-gray-900 mb-6">
//               Yêu cầu thanh toán
//             </h1>

//             {/* Danh sách yêu cầu thanh toán */}
//             {paymentRequests.length === 0 ? (
//               <div className="text-center py-12">
//                 <CheckCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   Không có yêu cầu thanh toán nào
//                 </h3>
//                 <p className="text-gray-500">
//                   Hiện tại không có yêu cầu thanh toán nào đang chờ xử lý.
//                 </p>
//               </div>
//             ) : (
//               <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Tên người dùng
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Tên khóa học
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Giá (VNĐ)
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Nội dung chuyển khoản
//                       </th>
//                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Hành động
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {paymentRequests.map((request) => (
//                       <tr key={request.id}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {request.username}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {request.courseName}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {request.price.toLocaleString()}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-500">
//                           {request.transferContent}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <button
//                             onClick={() =>
//                               handleApprovePayment(
//                                 request.id,
//                                 request.courseId,
//                                 request.username
//                               )
//                             }
//                             className="text-green-600 hover:text-green-800 mr-4"
//                             title="Chấp nhận"
//                           >
//                             <CheckCircleIcon className="h-5 w-5" />
//                           </button>
//                           <button
//                             onClick={() => handleRejectPayment(request.id)}
//                             className="text-red-600 hover:text-red-800"
//                             title="Từ chối"
//                           >
//                             <XCircleIcon className="h-5 w-5" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </TeacherLayout>
//   );
// };

// export default AdminPaymentApprovalPage;

import React, { useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface PaymentRequest {
  id: string;
  username: string;
  courseId: string;
  courseName: string;
  price: number;
  transferContent: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

// Dữ liệu giả
const fakePaymentRequests: PaymentRequest[] = [
  {
    id: "1",
    username: "nguyenvana",
    courseId: "c1",
    courseName: "HSK 1 Cơ bản",
    price: 1500000,
    transferContent: "Thanh toan HSK 1",
    status: "PENDING",
  },
  {
    id: "2",
    username: "tranthib",
    courseId: "c2",
    courseName: "HSK 2 Nâng cao",
    price: 2000000,
    transferContent: "Thanh toan HSK 2",
    status: "PENDING",
  },
  {
    id: "3",
    username: "lehongc",
    courseId: "c3",
    courseName: "HSK 3 Trung cấp",
    price: 2500000,
    transferContent: "Thanh toan HSK 3",
    status: "PENDING",
  },
  {
    id: "4",
    username: "phamvand",
    courseId: "c1",
    courseName: "HSK 1 Cơ bản",
    price: 1500000,
    transferContent: "Thanh toan HSK 1 cho Pham Van D",
    status: "PENDING",
  },
];

const AdminPaymentApprovalPage: React.FC = () => {
  const [paymentRequests, setPaymentRequests] =
    useState<PaymentRequest[]>(fakePaymentRequests);
  const [error, setError] = useState<string | null>(null);

  // Thống kê số lượng yêu cầu theo trạng thái
  const stats = [
    {
      title: "Yêu cầu đang chờ",
      count: paymentRequests.filter((req) => req.status === "PENDING").length,
      color: "bg-yellow-500",
      href: "#",
    },
    {
      title: "Yêu cầu đã duyệt",
      count: paymentRequests.filter((req) => req.status === "APPROVED").length,
      color: "bg-green-600",
      href: "#",
    },
    {
      title: "Yêu cầu đã từ chối",
      count: paymentRequests.filter((req) => req.status === "REJECTED").length,
      color: "bg-red-600",
      href: "#",
    },
  ];

  // Dữ liệu biểu đồ: Số yêu cầu theo khóa học
  const courseRequestCounts = paymentRequests.reduce((acc, req) => {
    acc[req.courseName] = (acc[req.courseName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const barData = {
    labels: Object.keys(courseRequestCounts),
    datasets: [
      {
        label: "Số yêu cầu thanh toán",
        backgroundColor: "#2563eb",
        data: Object.values(courseRequestCounts),
      },
    ],
  };

  // Danh sách menu sidebar
  const sidebarItems = [
    {
      id: "students",
      label: "Học viên",
      href: "/admin/students",
      notificationCount: 0,
    },
    {
      id: "courses",
      label: "Khóa học",
      href: "/admin/courses",
      notificationCount: 0,
    },
    {
      id: "upcoming",
      label: "Sắp khai giảng",
      href: "/admin/upcoming-courses",
      notificationCount: 2,
    },
    {
      id: "feedback",
      label: "Phản hồi",
      href: "/admin/feedback",
      notificationCount: 3,
    },
    {
      id: "payments",
      label: "Yêu cầu thanh toán",
      href: "/admin/payments",
      notificationCount: paymentRequests.filter(
        (req) => req.status === "PENDING"
      ).length,
    },
  ];

  // Thông báo cho admin
  const adminNotifications = [
    {
      id: "1",
      title: "Yêu cầu thanh toán mới",
      message: "Có 3 yêu cầu thanh toán mới cần duyệt",
      time: "10 phút trước",
      type: "info" as const,
      read: false,
    },
    {
      id: "2",
      title: "Yêu cầu đã duyệt",
      message: "Yêu cầu thanh toán cho HSK 1 đã được duyệt",
      time: "1 giờ trước",
      type: "success" as const,
      read: true,
    },
  ];

  // Xử lý chấp nhận yêu cầu
  const handleApprovePayment = (
    requestId: string,
    courseId: string,
    username: string
  ) => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn chấp nhận yêu cầu này? Người dùng sẽ được ghi danh vào khóa học."
      )
    )
      return;

    setPaymentRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "APPROVED" } : req
      )
    );
    // Giả lập ghi danh (thay bằng API thật nếu có)
    console.log(`Ghi danh ${username} vào khóa học ${courseId}`);
    setError(null);
  };

  // Xử lý từ chối yêu cầu
  const handleRejectPayment = (requestId: string) => {
    if (!confirm("Bạn có chắc chắn muốn từ chối yêu cầu này?")) return;

    setPaymentRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "REJECTED" } : req
      )
    );
    setError(null);
  };

  return (
    <AdminLayout logoImage={logoImage} activePath="/admin-dashboard/payment">
      <div className="flex min-h-screen bg-gray-50">
        {/* Main content */}
        <main className="flex-1 flex flex-col">
          <DashboardHeader
            title="Quản lý yêu cầu thanh toán"
            notifications={adminNotifications}
          />
          <div className="flex-1 p-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {stats.map((stat, index) => (
                <a
                  href={stat.href}
                  key={index}
                  className="transform hover:scale-105 transition-all"
                >
                  <div className="rounded-xl shadow-md overflow-hidden">
                    <div className={`p-5 text-white text-center ${stat.color}`}>
                      <h3 className="text-lg font-semibold">{stat.title}</h3>
                    </div>
                    <div className="bg-white py-4 text-center">
                      <p
                        className={`text-3xl font-bold text-${stat.color.replace(
                          "bg-",
                          ""
                        )}`}
                      >
                        {stat.count}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Biểu đồ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Thống kê yêu cầu thanh toán theo khóa học
                </h2>
                <Bar data={barData} options={{ responsive: true }} />
              </div>
            </div>

            {/* Bảng yêu cầu thanh toán */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Danh sách yêu cầu thanh toán
              </h2>
              {error && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              {paymentRequests.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không có yêu cầu thanh toán
                  </h3>
                  <p className="text-gray-500">
                    Hiện tại không có yêu cầu thanh toán nào.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên người dùng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên khóa học
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá (VNĐ)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nội dung chuyển khoản
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.courseName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {request.transferContent}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                request.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : request.status === "APPROVED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {request.status === "PENDING"
                                ? "Đang chờ"
                                : request.status === "APPROVED"
                                ? "Đã duyệt"
                                : "Đã từ chối"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {request.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleApprovePayment(
                                      request.id,
                                      request.courseId,
                                      request.username
                                    )
                                  }
                                  className="text-green-600 hover:text-green-800 mr-4"
                                  title="Chấp nhận"
                                >
                                  <CheckCircleIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleRejectPayment(request.id)
                                  }
                                  className="text-red-600 hover:text-red-800"
                                  title="Từ chối"
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
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentApprovalPage;
