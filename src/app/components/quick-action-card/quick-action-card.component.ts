import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quick-action-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './quick-action-card.component.html',
  styleUrl: './quick-action-card.component.css'
})
export class QuickActionCardComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() description?: string = '';
  @Input() routerLink = '';
  @Input() bgColor = 'primary';
}
