import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaAsistentesPage } from './lista-asistentes.page';

describe('ListaAsistentesPage', () => {
  let component: ListaAsistentesPage;
  let fixture: ComponentFixture<ListaAsistentesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAsistentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
