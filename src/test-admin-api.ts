// Test file for admin user management API endpoints
import { userService } from './services/userService';

export const testAdminUserAPI = async () => {
  console.log('🧪 Testing Admin User Management API...');
  
  try {
    // Test 1: Get all users for admin
    console.log('📋 Testing getAllUsersForAdmin...');
    const allUsers = await userService.getAllUsersForAdmin();
    console.log('✅ All users:', allUsers);
    
    // Test 2: Get teachers for admin
    console.log('👨‍🏫 Testing getTeachersForAdmin...');
    const teachers = await userService.getTeachersForAdmin();
    console.log('✅ Teachers:', teachers);
    
    // Test 3: Get students for admin
    console.log('👨‍🎓 Testing getStudentsForAdmin...');
    const students = await userService.getStudentsForAdmin();
    console.log('✅ Students:', students);
    
    console.log('🎉 All admin user API tests completed successfully!');
    
    return {
      allUsers,
      teachers,
      students
    };
    
  } catch (error) {
    console.error('❌ Error testing admin user API:', error);
    throw error;
  }
};

// Optional: Test other admin functions
export const testAdminUserActions = async () => {
  console.log('🔧 Testing Admin User Actions...');
  
  try {
    // Test change role (commented out to avoid accidental changes)
    // if (testUserId) {
    //   console.log('🔄 Testing changeUserRole...');
    //   await userService.changeUserRole(testUserId, 'TEACHER');
    //   console.log('✅ Role changed successfully');
    // }
    
    // Test add teacher (commented out to avoid creating test users)
    // console.log('➕ Testing addTeacher...');
    // const newTeacher = {
    //   name: 'Test Teacher',
    //   email: 'test.teacher@example.com',
    //   password: 'testpassword123'
    // };
    // await userService.addTeacher(newTeacher);
    // console.log('✅ Teacher added successfully');
    
    console.log('ℹ️ Admin action tests skipped (commented out for safety)');
    
  } catch (error) {
    console.error('❌ Error testing admin user actions:', error);
    throw error;
  }
};

// You can call this function from console or in development
if (import.meta.env.DEV) {
  // Uncomment to run tests automatically in development
  // testAdminUserAPI().catch(console.error);
}
