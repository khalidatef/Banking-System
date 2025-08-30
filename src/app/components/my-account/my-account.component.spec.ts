import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyAccountComponent } from './my-account.component';
import { commonTestProviders } from '../../../test-setup';

describe('MyAccountComponent', () => {
  let component: MyAccountComponent;
  let fixture: ComponentFixture<MyAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAccountComponent],
      providers: commonTestProviders
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
