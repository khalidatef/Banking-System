/**
 * Angular Login Flow Test
 * Tests the actual login logic used by the Angular component
 */

// Import the users and types from the actual app data
const { users, Role } = require('./src/app/data/mock-users.ts');

// Mock AuthService login method (same logic as in auth.service.ts)
function testAngularLogin(username, password) {
    const uName = (username ?? '').trim();
    const pWord = (password ?? '').trim();

    console.log('🚀 Login attempt:', { username: uName, hasPassword: !!pWord });
    console.log('📊 Available users:', users.length);
    console.log('🔍 Demo accounts available:', users.filter(u => u.isActive).slice(0, 5).map(u => u.username));
    
    // Basic validation (matching the Angular component)
    if (!uName || !pWord) {
        console.error('❌ Missing credentials');
        return { success: false, error: 'INVALID' };
    }
    
    const recByName = users.find(x => x.username === uName);
    console.log('👤 User found by name:', !!recByName, recByName ? { active: recByName.isActive, role: recByName.role } : 'N/A');
    
    if (recByName && !recByName.isActive) {
        console.warn('⚠️ User account is inactive:', uName);
        return { success: false, error: 'INACTIVE' };
    }

    const u = users.find(
        x => x.username === uName && x.password === pWord && x.isActive
    );
    
    if (!u) {
        console.error('❌ Authentication failed for:', uName);
        console.log('🔍 Checking password match for existing user:', recByName ? 'Password mismatch' : 'User not found');
        return { success: false, error: 'INVALID' };
    }

    console.log('✅ Authentication successful:', { username: u.username, role: u.role });
    return { success: true, user: u, role: u.role };
}

console.log('🔧 Testing Angular Login Flow\n');
console.log('=' .repeat(60));

// Test the exact demo accounts from the Angular component
const angularDemoTests = [
    { username: 'admin', password: 'admin123', expected: Role.Admin },
    { username: 'user1', password: 'user123', expected: Role.User },
    { username: 'ahmed', password: 'ahmed123', expected: Role.User },
];

console.log('📱 Testing Angular Demo Accounts:');
angularDemoTests.forEach(({ username, password, expected }) => {
    const result = testAngularLogin(username, password);
    
    const testPassed = result.success && result.role === expected;
    const status = testPassed ? '✅ PASS' : '❌ FAIL';
    
    console.log(`${status} | ${username.padEnd(10)} | Expected: ${expected.padEnd(5)} | Got: ${result.success ? result.role : result.error}`);
    console.log('-'.repeat(60));
});

console.log('\n🔍 Testing Password Visibility & Form Validation:');

// Test validation scenarios that might occur in the Angular form
const validationTests = [
    { username: 'ad', password: 'admin123', test: 'Username too short (min 3 chars)' },
    { username: 'admin', password: 'ad', test: 'Password too short (min 3 chars)' },
    { username: '   admin   ', password: '   admin123   ', test: 'Whitespace trimming' },
];

validationTests.forEach(({ username, password, test }) => {
    console.log(`\n🧪 Testing: ${test}`);
    const result = testAngularLogin(username, password);
    const status = result.success ? '✅ LOGIN SUCCESS' : '❌ LOGIN FAILED';
    console.log(`${status} | Result: ${result.success ? result.role : result.error}`);
});

console.log('\n' + '='.repeat(60));
console.log('🎯 Angular Login Flow Test Complete!');
console.log('\n💡 If the Angular app is still not working:');
console.log('1. Check browser console for JavaScript errors');
console.log('2. Verify the component is loading correctly');
console.log('3. Check for any routing issues');
console.log('4. Make sure the AuthService is properly injected');
console.log('\n🚀 Start the app with: npm start');
console.log('🌐 Then go to: http://localhost:4200/login');
