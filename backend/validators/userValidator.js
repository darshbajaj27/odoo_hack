// ============================================
// backend/validators/userValidator.js
// ============================================
const userValidator = {
  /**
   * Validate user creation/registration
   */
  validateCreate(data) {
    const errors = [];
    const validRoles = ['MANAGER', 'STAFF'];

    // Email validation
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Valid email address is required');
    }

    // Password validation
    if (!data.password) {
      errors.push('Password is required');
    } else if (data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    } else if (!this.isValidPassword(data.password)) {
      errors.push(
        'Password must contain uppercase, lowercase, and numeric characters'
      );
    }

    // Name validation
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Full name is required');
    } else if (data.name.length > 100) {
      errors.push('Name must not exceed 100 characters');
    }

    // Role validation
    if (data.role && !validRoles.includes(data.role)) {
      errors.push(`Role must be one of: ${validRoles.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate user update
   */
  validateUpdate(data) {
    const errors = [];
    const validRoles = ['MANAGER', 'STAFF'];
    const validStatuses = ['ACTIVE', 'INACTIVE'];

    if (data.name !== undefined && data.name !== null) {
      if (typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Name cannot be empty');
      } else if (data.name.length > 100) {
        errors.push('Name must not exceed 100 characters');
      }
    }

    if (data.role !== undefined && data.role !== null) {
      if (!validRoles.includes(data.role)) {
        errors.push(`Role must be one of: ${validRoles.join(', ')}`);
      }
    }

    if (data.status !== undefined && data.status !== null) {
      if (!validStatuses.includes(data.status)) {
        errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate password change
   */
  validatePasswordChange(currentPassword, newPassword, confirmPassword) {
    const errors = [];

    if (!currentPassword) {
      errors.push('Current password is required');
    }

    if (!newPassword) {
      errors.push('New password is required');
    } else if (newPassword.length < 8) {
      errors.push('New password must be at least 8 characters');
    } else if (!this.isValidPassword(newPassword)) {
      errors.push(
        'New password must contain uppercase, lowercase, and numeric characters'
      );
    }

    if (newPassword !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (currentPassword === newPassword) {
      errors.push('New password must be different from current password');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   * At least 8 chars, 1 uppercase, 1 lowercase, 1 number
   */
  isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  },
};

module.exports = userValidator;
