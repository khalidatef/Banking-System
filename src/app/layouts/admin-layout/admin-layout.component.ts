import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AdminNavComponent } from '../../components/admin-nav/admin-nav.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, AdminNavComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  isLoading = false;
  sidebarOpen = false;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    // Subscribe to loading states if needed
    this.initializeLayout();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private initializeLayout(): void {
    // Initialize any layout-specific logic
    console.log('Admin layout initialized');
  }
  
  /**
   * Toggle sidebar (if needed for future enhancements)
   */
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
  
  /**
   * Show loading overlay
   */
  showLoading(): void {
    this.isLoading = true;
  }
  
  /**
   * Hide loading overlay
   */
  hideLoading(): void {
    this.isLoading = false;
  }
}
