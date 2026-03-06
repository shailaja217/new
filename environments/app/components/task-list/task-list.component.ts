import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error = '';

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: tasks => {
        this.tasks = tasks;
        this.loading = false;
      },
      error: err => {
        this.error = 'Failed to load tasks';
        this.loading = false;
      }
    });
  }

  editTask(id: number) {
    this.router.navigate(['/tasks', id, 'edit']);
  }

  deleteTask(id: number) {
    if (!confirm('Delete this task?')) return;
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: () => this.error = 'Failed to delete task'
    });
  }
} 