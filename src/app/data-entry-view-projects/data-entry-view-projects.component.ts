import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-data-entry-view-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-entry-view-projects.component.html',
  styleUrl: './data-entry-view-projects.component.css'
})
export class DataEntryViewProjectsComponent implements OnInit {

  loading = true;

  sections: {
    key: string;
    title: string;
    items: any[];
  }[] = [];

  constructor(
    private projectsService: ProjectsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const { from, to } = this.getMonths();
    this.loadData(from, to);
  }

  loadData(from: string, to: string): void {
    this.loading = true;

    this.projectsService.getProjectsExpenses(from, to).subscribe({
      next: (res) => {
        const grouped = res.projects || {};

        this.sections = [
          {
            key: 'active',
            title: 'Active Projects',
            items: grouped.active || []
          },
          {
            key: 'completed',
            title: 'Completed Projects (Current & Previous Month)',
            items: grouped.completed || []
          },
          {
            key: 'paused',
            title: 'Paused Projects (Current & Previous Month)',
            items: grouped.paused || []
          }
        ];

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getMonths() {
    const now = new Date();
    const to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prev = new Date(now.getFullYear(), now.getMonth() - 1);
    const from = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
    return { from, to };
  }

  addPayment(projectId: string): void {
    this.router.navigate(['dashboard/addPayments'], {
      queryParams: { projectId }
    });
  }
}
