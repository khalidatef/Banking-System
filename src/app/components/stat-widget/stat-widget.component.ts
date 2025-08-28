import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-widget.component.html',
  styleUrl: './stat-widget.component.css'
})
export class StatWidgetComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() icon = '';
  @Input() color = 'primary';
  @Input() currency = 'EGP';
}
