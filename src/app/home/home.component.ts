import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // 🧹 أول ما الهوم تفتح نمسح أي login قديم
ngOnInit(): void {
  localStorage.clear();

  this.loginForm.valueChanges.subscribe(value => {
    console.log('✏️ FORM CHANGES 👉', value);
  });
}
showPassword = false;

togglePassword(): void {
  this.showPassword = !this.showPassword;
}


 submit(): void {
  if (this.loginForm.invalid) {
    this.errorMessage = 'Please enter valid email and password';
    return;
  }

  // 🔍 اطبعي الداتا قبل الإرسال
  const payload = {
    email: this.loginForm.value.email,
    password: this.loginForm.value.password
  };

  console.log('📤 DATA BEFORE SEND 👉', payload);
  console.log('📤 STRINGIFIED 👉', JSON.stringify(payload));

  this.authService.login(payload).subscribe({
    next: (res) => {
      const token = res.token;
      const role = res.role?.toLowerCase();

      if (!token || !role) {
        this.errorMessage = 'Invalid login response from server';
        return;
      }


      localStorage.setItem('role', role);
      localStorage.setItem('token', res.token);

      if (role === 'admin') {
        this.router.navigate(['/mainDashboard']);
      } else if (role === 'data-entry') {
        this.router.navigate(['/dashboard']);
      }
    },
    error: (err) => {
      this.errorMessage =
        err?.error?.message || 'Invalid email or password';
    }
  });
}

}
