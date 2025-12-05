import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevoEventoPage } from './nuevo-evento.page';

describe('NuevoEventoPage', () => {
  let component: NuevoEventoPage;
  let fixture: ComponentFixture<NuevoEventoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoEventoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
