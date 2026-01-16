import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-data-entry-change-pass',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './data-entry-change-pass.component.html',
  styleUrl: './data-entry-change-pass.component.css'
})
export class DataEntryChangePassComponent implements OnInit {

  name = '';
  form!: FormGroup;

  submitError = '';
  submitSuccess = '';
  submitLoading = false;

showOldPassword = false;
showNewPassword = false;
showConfirmPassword = false;


  constructor(
    private fb: FormBuilder,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.name = this.getUserNameFromToken();
  }

  initForm(): void {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  getUserNameFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return 'User';

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.name || 'User';
    } catch {
      return 'User';
    }
  }

  submit(): void {
    this.submitError = '';
    this.submitSuccess = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submitError = 'Please complete all required fields';
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = this.form.value;

    if (newPassword !== confirmPassword) {
      this.submitError = 'New password and confirmation do not match';
      return;
    }

    this.submitLoading = true;

    const payload = { oldPassword, newPassword };

    this.usersService.changePassword(payload).subscribe({
      next: (res) => {
        this.submitLoading = false;
        this.submitSuccess = res?.message || 'Password changed successfully';
        this.form.reset();
      },
      error: (err) => {
        this.submitLoading = false;
        this.submitError =
          err?.error?.message || 'Failed to change password';
      }
    });
  }
}
