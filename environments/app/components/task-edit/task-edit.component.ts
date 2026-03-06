import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {
  taskForm: FormGroup;
  isEdit = false;
  taskId: number | null = null;
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: ['Todo', Validators.required],
      priority: ['Medium', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.taskId) {
      this.isEdit = true;
      this.loading = true;
      this.taskService.getTask(this.taskId).subscribe({
        next: task => {
          this.taskForm.patchValue(task);
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load task';
          this.loading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.taskForm.invalid) return;
    this.loading = true;
    const taskData = this.taskForm.value;
    if (this.isEdit && this.taskId) {
      this.taskService.updateTask(this.taskId, taskData).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: () => {
          this.error = 'Failed to update task';
          this.loading = false;
        }
      });
    } else {
      this.taskService.addTask(taskData).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: () => {
          this.error = 'Failed to add task';
          this.loading = false;
        }
      });
    }
  }
} 