import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoLinkTestcase } from './proyecto-link-testcase';

describe('ProyectoLinkTestcase', () => {
  let component: ProyectoLinkTestcase;
  let fixture: ComponentFixture<ProyectoLinkTestcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoLinkTestcase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoLinkTestcase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
