import React, { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import logoImage from "../../images/d1fe66745c26de30ce87421d08acff5f22ef002b.jpg"; // Adjust path if needed
import DashboardHeader from "../../components/DashboardHeader";
import AdminLayout from "../../components/admin/AdminLayout";
// import AdminAPITester from "../../components/admin/AdminAPITester";
const AdminUserManagementPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Sử dụng các endpoint riêng biệt cho admin
      const [studentsData, teachersData] = await Promise.all([
        userService.getStudentsForAdmin(),
        userService.getTeachersForAdmin()
      ]);
      
      console.log('Students data:', studentsData);
      console.log('Teachers data:', teachersData);
      
      setStudents(studentsData);
      setTeachers(teachersData);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await userService.changeUserRole(userId, newRole);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to change role");
    }
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    try {
      await userService.updateUserInfo(editUser.id, editUser);
      setEditUser(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    }
  };

  const handleAddTeacher = async () => {
    try {
      await userService.addTeacher(newTeacher);
      setNewTeacher({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to add teacher");
    }
  };
   if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <AdminLayout logoImage={logoImage} activePath="/admin-dashboard/dashboard">
      <div className="flex min-h-screen bg-gray-50">
        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {" "}
          <DashboardHeader
            title="Trang quản trị"
            
          />
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Students Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Sinh viên</h2>
          <button 
            onClick={fetchUsers} 
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Reload
          </button>
        </div>
        <table className="w-full border mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Tên</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Role</th>
              <th className="border px-2 py-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {students.map((u) => (
              <tr key={u.id}>
                <td className="border px-2 py-1">
                  {editUser?.id === u.id ? (
                    <input value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} />
                  ) : u.name}
                </td>
                <td className="border px-2 py-1">
                  {editUser?.id === u.id ? (
                    <input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
                  ) : u.email}
                </td>
                <td className="border px-2 py-1">{u.role}</td>
                <td className="border px-2 py-1">
                  {editUser?.id === u.id ? (
                    <>
                      <button onClick={handleUpdateUser} className="text-green-600 mr-2">Lưu</button>
                      <button onClick={() => setEditUser(null)} className="text-gray-600">Hủy</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditUser(u)} className="text-blue-600 mr-2">Sửa</button>
                      <button onClick={() => handleRoleChange(u.id, "TEACHER")} className="text-purple-600">Chuyển thành giáo viên</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Teachers Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Giáo viên</h2>
          <button 
            onClick={fetchUsers} 
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Reload
          </button>
        </div>
        <table className="w-full border mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Tên</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Role</th>
              <th className="border px-2 py-1">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((u) => (
              <tr key={u.id}>
                <td className="border px-2 py-1">{u.name}</td>
                <td className="border px-2 py-1">{u.email}</td>
                <td className="border px-2 py-1">{u.role}</td>
                <td className="border px-2 py-1">
                  <button onClick={() => handleRoleChange(u.id, "STUDENT")} className="text-orange-600">Chuyển thành sinh viên</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Thêm giáo viên mới</h3>
          <input
            className="border px-2 py-1 mr-2"
            placeholder="Tên"
            value={newTeacher.name}
            onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })}
          />
          <input
            className="border px-2 py-1 mr-2"
            placeholder="Email"
            value={newTeacher.email}
            onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
          />
          <input
            className="border px-2 py-1 mr-2"
            placeholder="Mật khẩu"
            type="password"
            value={newTeacher.password}
            onChange={e => setNewTeacher({ ...newTeacher, password: e.target.value })}
          />
          <button onClick={handleAddTeacher} className="bg-blue-600 text-white px-4 py-1 rounded">Thêm giáo viên</button>
        </div>
      </div>
    </div>

</main>
</div>
{/* Development API Tester */}
</AdminLayout>
  );
};
export default AdminUserManagementPage;