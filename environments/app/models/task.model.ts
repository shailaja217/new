export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
  userId: number;
} 