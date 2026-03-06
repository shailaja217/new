import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private isBrowser: boolean;
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(@Inject(PLATFORM_ID) platformId: Object, private http: HttpClient) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadTasks();
  }

  private loadTasks(): void {
    if (this.isBrowser) {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        this.tasks = parsedTasks.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate)
        }));
        this.tasksSubject.next(this.tasks);
      }
    }
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getPendingTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/pending`);
  }

  getCompletedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/completed`);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  markTaskAsCompleted(id: number): Observable<Task> {
    return this.updateTask(id, { status: 'completed' });
  }

  addTask(task: Omit<Task, 'id'>): void {
    const newTask: Task = {
      ...task,
      id: Date.now()
    };
    this.tasks.push(newTask);
    this.updateTasks();
  }

  private updateTasks(): void {
    this.tasksSubject.next(this.tasks);
    if (this.isBrowser) {
      const tasksToStore = this.tasks.map(task => ({
        ...task,
        dueDate: task.dueDate.toISOString()
      }));
      localStorage.setItem('tasks', JSON.stringify(tasksToStore));
    }
  }
} 