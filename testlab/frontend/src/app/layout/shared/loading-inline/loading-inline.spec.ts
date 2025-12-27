import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingInline } from './loading-inline';

describe('LoadingInline', () => {
  let component: LoadingInline;
  let fixture: ComponentFixture<LoadingInline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingInline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingInline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
