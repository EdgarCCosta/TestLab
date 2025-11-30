import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionesList } from './versiones-list';

describe('VersionesList', () => {
  let component: VersionesList;
  let fixture: ComponentFixture<VersionesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
