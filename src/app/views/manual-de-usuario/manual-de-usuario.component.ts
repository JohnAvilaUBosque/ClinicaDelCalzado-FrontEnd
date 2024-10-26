import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { BaseService } from '../../base.service';
import { ConstantsService } from 'src/app/constants.service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ButtonModule } from '@coreui/angular';

@Component({
  selector: 'app-manual-de-usuario',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './manual-de-usuario.component.html',
  styleUrl: './manual-de-usuario.component.scss'
})
export class ManualDeUsuarioComponent implements AfterViewInit {

  private baseService = inject(BaseService);
  private sanitizer = inject(DomSanitizer);
  private elRef = inject(ElementRef);
  private titleService = inject(Title);
  private CONST = inject(ConstantsService);

  public manualUrl!: any;
  public nombrePdf!: any;
  public height!: string;

  constructor() {
    this.titleService.setTitle(this.CONST.NOMBRE_EMPRESA + ' - Manual de usuario');

    var adminLocal = this.baseService.obtenerAdminLocal();

    var pdfUrl: string;
    if (adminLocal.rol == this.CONST.ROL_ADMIN.SECUNDARIO)
      this.nombrePdf = 'Manual de usuario - Admin Secundario.pdf';
    else
      this.nombrePdf = 'Manual de usuario - Admin Principal.pdf';

    const timestamp = new Date().getTime();
    pdfUrl = '/assets/' + this.nombrePdf + '?timestamp=' + timestamp;

    this.manualUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const parentElement = this.elRef.nativeElement.closest('.body');
      this.height = (parentElement?.offsetHeight || 800) - 20 + 'px';
    }, 100);
  }

  navegarAPdf() {
    window.open(this.manualUrl.changingThisBreaksApplicationSecurity, '_blank');
  }
}
