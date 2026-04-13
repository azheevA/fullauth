import { UserRole } from '@prisma/generated';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: UserRole | null;
    }

    interface Request {
      user: User | null;
    }
  }
}
