import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';

@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  standalone: true,
  imports: [RouterOutlet, IconModule],
  providers: [IconSetService]
})
export class AppComponent implements OnInit {
  title = 'Clinica del calzado';

  constructor(
    private router: Router,
    private titleService: Title,
    public iconSetService: IconSetService
  ) {
    this.titleService.setTitle(this.title);
    iconSetService.icons = freeSet;
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
