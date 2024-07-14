import { Component } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-crear-orden',
  standalone: true,
  imports: [CardComponent, CardBodyComponent, CardHeaderComponent, TableModule],
  templateUrl: './crear-orden.component.html',
  styleUrl: './crear-orden.component.scss'
})
export class CrearOrdenComponent {

}
