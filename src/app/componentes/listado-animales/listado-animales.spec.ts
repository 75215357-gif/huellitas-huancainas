import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoAnimales } from './listado-animales';

describe('ListadoAnimales', () => {
  let component: ListadoAnimales;
  let fixture: ComponentFixture<ListadoAnimales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoAnimales],
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoAnimales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
