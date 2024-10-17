import { Component } from '@angular/core';
import { ContainerComponent, RowComponent, ColComponent, ButtonDirective } from '@coreui/angular';

@Component({
    selector: 'app-page500',
    templateUrl: './page500.component.html',
    styleUrls: ['./page500.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, ButtonDirective]
})
export class Page500Component {

  constructor() { }

}
