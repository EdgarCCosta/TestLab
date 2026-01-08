import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoLinkUser } from './proyecto-link-user';

describe('ProyectoLinkUser', () => {
  let component: ProyectoLinkUser;
  let fixture: ComponentFixture<ProyectoLinkUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProyectoLinkUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoLinkUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
