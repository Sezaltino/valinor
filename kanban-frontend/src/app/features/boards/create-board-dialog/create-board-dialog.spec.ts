import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBoardDialog } from './create-board-dialog';

describe('CreateBoardDialog', () => {
  let component: CreateBoardDialog;
  let fixture: ComponentFixture<CreateBoardDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBoardDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBoardDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
