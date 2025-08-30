/**
 * Authentication Testing Utility
 * Tests all demo accounts to ensure they work correctly
 */

// Mock users data (same as in the app)
const users = [
  // Primary demo accounts
  { id: "1", username: "admin", password: "admin123", role: "Admin", isActive: true },
  { id: "2", username: "ahmed", password: "ahmed123", role: "User", isActive: true },
  { id: "3", username: "user1", password: "user123", role: "User", isActive: true },
  
  // Additional test accounts
  { id: "4", username: "john_doe", password: "s3cur3P@ss1", role: "User", isActive: true },
  { id: "5", username: "admin_alice", password: "Adm!nP@ss2023", role: "Admin", isActive: true },
  { id: "6", username: "m_smith", password: "TempP@ss123", role: "User", isActive: false }, // Inactive
  { id: "7", username: "jane_white", password: "J@n3Wh!t3", role: "User", isActive: true },
];

// Test authentication function
function testLogin(username, password) {
  const uName = (username ?? '').trim();
  const pWord = (password ?? '').trim();

  const recByName = users.find(x => x.username === uName);
  if (recByName && !recByName.isActive) {
    return { success: false, error: 'INACTIVE', message: 'Account is inactive' };
  }

  const u = users.find(x => x.username === uName && x.password === pWord && x.isActive);
  if (!u) {
    return { success: false, error: 'INVALID', message: 'Invalid username or password' };
  }

  return { success: true, user: u, role: u.role };
}

// Test all demo accounts
console.log('🧪 Testing Demo Accounts Authentication\n');
console.log('=' .repeat(60));

const demoAccounts = [
  { username: 'admin', password: 'admin123', expected: 'Admin' },
  { username: 'ahmed', password: 'ahmed123', expected: 'User' },
  { username: 'user1', password: 'user123', expected: 'User' },
  { username: 'john_doe', password: 's3cur3P@ss1', expected: 'User' },
  { username: 'admin_alice', password: 'Adm!nP@ss2023', expected: 'Admin' },
  { username: 'm_smith', password: 'TempP@ss123', expected: 'INACTIVE' }, // Should fail
  { username: 'jane_white', password: 'J@n3Wh!t3', expected: 'User' },
];

// Test invalid cases
const invalidCases = [
  { username: 'admin', password: 'wrong123', expected: 'INVALID' },
  { username: 'nonexistent', password: 'anything', expected: 'INVALID' },
  { username: '', password: '', expected: 'INVALID' },
  { username: 'admin', password: '', expected: 'INVALID' },
];

let passedTests = 0;
let totalTests = 0;

// Test demo accounts
demoAccounts.forEach(({ username, password, expected }) => {
  totalTests++;
  const result = testLogin(username, password);
  
  let testPassed = false;
  let status = '';
  
  if (expected === 'INACTIVE') {
    testPassed = !result.success && result.error === 'INACTIVE';
    status = testPassed ? '✅ PASS' : '❌ FAIL';
  } else {
    testPassed = result.success && result.role === expected;
    status = testPassed ? '✅ PASS' : '❌ FAIL';
  }
  
  if (testPassed) passedTests++;
  
  console.log(`${status} | ${username.padEnd(12)} | Expected: ${expected.padEnd(8)} | Got: ${result.success ? result.role : result.error}`);
});

console.log('\n' + '-'.repeat(60));

// Test invalid cases
console.log('Testing Invalid Cases:');
invalidCases.forEach(({ username, password, expected }) => {
  totalTests++;
  const result = testLogin(username, password);
  
  const testPassed = !result.success && result.error === expected;
  const status = testPassed ? '✅ PASS' : '❌ FAIL';
  
  if (testPassed) passedTests++;
  
  const displayUsername = username || '(empty)';
  const displayPassword = password || '(empty)';
  console.log(`${status} | ${displayUsername.padEnd(12)} | ${displayPassword.padEnd(12)} | Expected: ${expected}`);
});

console.log('\n' + '='.repeat(60));
console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log('🎉 All authentication tests passed!');
  console.log('\n📝 Demo Account Summary:');
  console.log('- admin / admin123 (Admin role)');
  console.log('- ahmed / ahmed123 (User role)'); 
  console.log('- user1 / user123 (User role)');
  console.log('- john_doe / s3cur3P@ss1 (User role)');
  console.log('- admin_alice / Adm!nP@ss2023 (Admin role)');
  console.log('- jane_white / J@n3Wh!t3 (User role)');
  console.log('\n⚠️  Inactive Account (should fail):');
  console.log('- m_smith / TempP@ss123 (Inactive)');
} else {
  console.log('❌ Some tests failed. Check the authentication logic.');
}

console.log('\n🔧 If authentication is still failing in the app:');
console.log('1. Check browser console for detailed logs');
console.log('2. Clear localStorage and try again');
console.log('3. Verify role guard paths are correct');
console.log('4. Check that users array is properly imported');
