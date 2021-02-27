const faker = require('faker');
const User = require('../../models/user.model');

describe('user model', () => {
  describe('user validation', () => {
    let newUser;

    beforeEach(() => {
      newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'user'
      };
    });

    it('should correctly validate a valid user', async () => {
      await expect(new User(newUser).validate().resolves).toBeUndefined();
    });

    it('should throw a validation error if email is invalid', async () => {
      newUser.email = 'invalidEmail';

      await expect(new User(newUser).validate())
        .rejects
        .toThrow('User validation failed: email: Invalid email');
    });

    it('should throw a validation error if password length is less than 8 characters', async () => {
      newUser.password = 'short';

      await expect(new User(newUser).validate())
        .rejects
        .toThrow('User validation failed: password: Path `password` (`short`) is shorter than the minimum allowed length (8).');
    });

    it('should throw a validation error if password does not contain numbers', async () => {
      newUser.password = 'password';

      await expect(new User(newUser).validate())
        .rejects
        .toThrow('User validation failed: password: Password must contain at least one letter and one number');
    });

    it('should throw a validation error if password does not contain letters', async () => {
      newUser.password = '123456789';

      await expect(new User(newUser).validate())
        .rejects
        .toThrow('User validation failed: password: Password must contain at least one letter and one number');
    });

    it('should throw a validation error if role is unknown', async () => {
      newUser.role = 'invalid';

      await expect(new User(newUser).validate())
        .rejects
        .toThrow('User validation failed: role: `invalid` is not a valid enum value for path `role`.');
    });
  });

  describe('user toJSON()', () => {
    it('should not return user password when toJSON is called', () => {
      const newUser = {
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'user'
      };

      expect(new User(newUser).toJSON()).not.toHaveProperty('password');
    });
  });
});
