describe('Validator', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(Validator.validateEmail('test@example.com')).toBe(true);
      expect(Validator.validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(Validator.validateEmail('invalid-email')).toBe(false);
      expect(Validator.validateEmail('test@')).toBe(false);
      expect(Validator.validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('should validate correct usernames', () => {
      expect(Validator.validateUsername('john_doe')).toBe(true);
      expect(Validator.validateUsername('user123')).toBe(true);
    });

    it('should reject invalid usernames', () => {
      expect(Validator.validateUsername('ab')).toBe(false); // Too short
      expect(Validator.validateUsername('a'.repeat(21))).toBe(false); // Too long
      expect(Validator.validateUsername('user@name')).toBe(false); // Invalid characters
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(Validator.validatePhone('+1 (555) 123-4567')).toBe(true);
      expect(Validator.validatePhone('1234567890')).toBe(true);
    });

    it('should accept empty phone numbers', () => {
      expect(Validator.validatePhone('')).toBe(true);
      expect(Validator.validatePhone(null)).toBe(true);
      expect(Validator.validatePhone(undefined)).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(Validator.validatePhone('abc')).toBe(false);
      expect(Validator.validatePhone('123-abc-4567')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should validate non-empty values', () => {
      expect(Validator.validateRequired('test')).toBe(true);
      expect(Validator.validateRequired('123')).toBe(true);
      expect(Validator.validateRequired(' ')).toBe(false);
    });

    it('should reject empty values', () => {
      expect(Validator.validateRequired('')).toBe(false);
      expect(Validator.validateRequired(null)).toBe(false);
      expect(Validator.validateRequired(undefined)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate correct passwords', () => {
      expect(Validator.validatePassword('Password123')).toBe(true);
      expect(Validator.validatePassword('Abc12345')).toBe(true);
    });

    it('should reject invalid passwords', () => {
      expect(Validator.validatePassword('password')).toBe(false); // No uppercase
      expect(Validator.validatePassword('PASSWORD')).toBe(false); // No lowercase
      expect(Validator.validatePassword('Pass123')).toBe(false); // Too short
      expect(Validator.validatePassword('Password')).toBe(false); // No number
    });
  });

  describe('validateForm', () => {
    it('should validate complete form data', () => {
      const formData = {
        account: {
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          email: 'john@example.com',
          phone: '+1 (555) 123-4567'
        }
      };

      const result = Validator.validateForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return errors for invalid form data', () => {
      const formData = {
        account: {
          firstName: '',
          lastName: '',
          username: 'jo',
          email: 'invalid-email',
          phone: 'invalid-phone'
        }
      };

      const result = Validator.validateForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('firstName');
      expect(result.errors).toHaveProperty('lastName');
      expect(result.errors).toHaveProperty('username');
      expect(result.errors).toHaveProperty('email');
      expect(result.errors).toHaveProperty('phone');
    });
  });
}); 