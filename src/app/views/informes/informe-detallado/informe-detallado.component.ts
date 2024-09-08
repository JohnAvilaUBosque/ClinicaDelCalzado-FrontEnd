import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ConstantsService } from 'src/app/constants.service';

@Component({
  selector: 'app-informe-detallado',
  standalone: true,
  imports: [],
  templateUrl: './informe-detallado.component.html',
  styleUrl: './informe-detallado.component.scss'
})
export class InformeDetalladoComponent implements OnInit {

  private titleService = inject(Title);

  public constService = inject(ConstantsService);

  ngOnInit(): void {
    this.titleService.setTitle(this.constService.TITLE + ' - ' + 'Informe detallado');
  }
}
