import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickActionCardComponent } from './quick-action-card.component';
import { commonTestProviders } from '../../../test-setup';

describe('QuickActionCardComponent', () => {
  let component: QuickActionCardComponent;
  let fixture: ComponentFixture<QuickActionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickActionCardComponent],
      providers: commonTestProviders
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuickActionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
