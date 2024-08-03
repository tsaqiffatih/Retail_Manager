import { CustomError } from "../middleware/errorHandler";

export const isStrongPassword = async (password: string): Promise<void> => {
    await new Promise<void>((resolve) => setTimeout(resolve, 100));
  
    const errors: string[] = [];
  
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    // Uncomment the following lines if you want to enforce special character requirement
    // if (!/[!@#\$%\^&\*]/.test(password)) {
    //   errors.push("Password must contain at least one special character (!@#$%^&*)");
    // }
  
    if (errors.length > 0) {
      const error = new Error(errors.join(' ')) as CustomError;
      error.name = 'WeakPasswordError';
      throw error;
    }
  };