import { users } from './mock-users';

describe('MockUsers', () => {
  it('should have mock users data', () => {
    expect(users.length).toBeGreaterThan(0);
  });
});
