import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { IconSetService } from '@coreui/icons-angular';
import { Page500Component } from './page500.component';
import { freeSet } from '@coreui/icons';

describe('Page500Component', () => {
  let component: Page500Component;
  let fixture: ComponentFixture<Page500Component>;
  let iconSetService: IconSetService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [GridModule, ButtonModule, FormModule, IconModule, Page500Component],
    providers: [IconSetService]
})
    .compileComponents();
  });

  beforeEach(() => {
    iconSetService = TestBed.inject(IconSetService);
    iconSetService.icons = freeSet;

    fixture = TestBed.createComponent(Page500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
