import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { IniciarSesion } from './iniciar-sesion';

describe('IniciarSesion', () => {
  let component: IniciarSesion;
  let fixture: ComponentFixture<IniciarSesion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IniciarSesion],
      providers: [
        provideRouter([]),
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IniciarSesion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
