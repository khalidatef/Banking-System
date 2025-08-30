import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminNavComponent } from './admin-nav.component';
import { commonTestProviders } from '../../../test-setup';

describe('AdminNavComponent', () => {
  let component: AdminNavComponent;
  let fixture: ComponentFixture<AdminNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNavComponent],
      providers: commonTestProviders
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
