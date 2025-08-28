import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatWidgetComponent } from './stat-widget.component';

describe('StatWidgetComponent', () => {
  let component: StatWidgetComponent;
  let fixture: ComponentFixture<StatWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
