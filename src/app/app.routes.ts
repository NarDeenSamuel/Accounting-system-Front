import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DataEntryAddProjectsComponent } from './data-entry-add-projects/data-entry-add-projects.component';
import { DataEntryViewProjectsComponent } from './data-entry-view-projects/data-entry-view-projects.component';
import { DataEntryAddPaymentsComponent } from './data-entry-add-payments/data-entry-add-payments.component';
import { DataEntryAddExpensesComponent } from './data-entry-add-expenses/data-entry-add-expenses.component';
import { DataEntryChangePassComponent } from './data-entry-change-pass/data-entry-change-pass.component';
import { ProjectsComponent } from './projects/projects.component';
import { PaymentsComponent } from './payments/payments.component';
import { SalariesComponent } from './salaries/salaries.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';

export const routes:Routes = [


  {path:'',redirectTo:'home',pathMatch:'full'},
  {path: 'home',component:HomeComponent},
  {path:"mainDashboard",component:AdminDashboardComponent,
    children:[
      {path:'Projects' ,component:ProjectsComponent},
      {path:'Payments',component:PaymentsComponent},
      {path:'Expenses',component:ExpensesComponent},
      {path:'Salaries',component:SalariesComponent},
      {path:'MonthlyReports',component:MonthlyReportComponent},
      {path:'changePass',component:DataEntryChangePassComponent},
      {path:"logOut",redirectTo:"/home" , pathMatch:'full'}
    ]
  },
  {path:"dashboard",component:DataEntryComponent ,
    children:[
      {path:'addProjects' ,component:DataEntryAddProjectsComponent},
      {path:'viewProjects',component:DataEntryViewProjectsComponent},
      {path:'addPayments',component:DataEntryAddPaymentsComponent},
      {path:'addExpenses',component:DataEntryAddExpensesComponent},
      {path:'changePass',component:DataEntryChangePassComponent},
      {path:"logOut",redirectTo:"/home" , pathMatch:'full'}
    ]
  },
  {path:'**',component:NotFoundComponent}


];
