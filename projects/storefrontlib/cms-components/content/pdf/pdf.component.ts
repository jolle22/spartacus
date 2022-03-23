import { Component, HostBinding } from '@angular/core';
import {
  CmsBannerComponentMedia,
  CmsPDFDocumentComponent,
} from '@spartacus/core';
import { FileDownloadService } from '../../../shared/services/file/file-download.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CmsComponentData } from '../../../cms-structure/page/model/cms-component-data';
import { MediaService } from '../../../shared/components/media/media.service';
import { MediaContainer } from '../../../shared/components/media/media.model';

@Component({
  selector: 'cx-pdf',
  templateUrl: './pdf.component.html',
})
export class PDFComponent {
  @HostBinding('class') styleClasses: string | undefined;

  data$: Observable<CmsPDFDocumentComponent> = this.component.data$.pipe(
    tap((data) => {
      this.styleClasses = data.styleClasses;
    })
  );
  constructor(
    protected component: CmsComponentData<CmsPDFDocumentComponent>,
    protected fileDownloadService: FileDownloadService,
    protected mediaService: MediaService
  ) {}

  protected download(file?: CmsBannerComponentMedia) {
    const url = this.mediaService.getMedia(file as MediaContainer)?.src;

    if (url) this.fileDownloadService.download(url);
  }
}
