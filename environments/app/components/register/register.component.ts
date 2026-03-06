import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.auth.register(
      this.registerForm.value.username,
      this.registerForm.value.password
    ).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: err => {
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
} 