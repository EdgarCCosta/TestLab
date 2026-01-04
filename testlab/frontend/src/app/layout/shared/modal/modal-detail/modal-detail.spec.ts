import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetail } from './modal-detail';

describe('Modal', () => {
  let component: ModalDetail;
  let fixture: ComponentFixture<ModalDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
