import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ConstantsService } from 'src/app/constants.service';

@Component({
  selector: 'informe-general',
  standalone: true,
  imports: [],
  templateUrl: './informe-general.component.html',
  styleUrl: './informe-general.component.scss'
})
export class InformeGeneralComponent {

  private titleService = inject(Title);

  public constService = inject(ConstantsService);

  ngOnInit(): void {
    this.titleService.setTitle(this.constService.NOMBRE_EMPRESA + ' - ' + 'Informe general');
  }
}
