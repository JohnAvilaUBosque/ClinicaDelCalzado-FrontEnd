import { Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ConstantsService } from 'src/app/constants.service';

@Component({
  selector: 'borrar-ordenes',
  standalone: true,
  imports: [],
  templateUrl: './borrar-ordenes.component.html',
  styleUrl: './borrar-ordenes.component.scss'
})
export class BorrarOrdenesComponent implements OnInit {

  private titleService = inject(Title);

  public constService = inject(ConstantsService);

  ngOnInit(): void {
    this.titleService.setTitle(this.constService.TITLE + ' - ' + 'Borrar órdenes de trabajo');
  }
}
