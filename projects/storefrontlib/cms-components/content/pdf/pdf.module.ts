import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, provideDefaultConfig } from '@spartacus/core';
import { PDFComponent } from './pdf.component';

@NgModule({
  imports: [CommonModule],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        VideoComponent: {
          component: PDFComponent,
        },
      },
    }),
  ],
  declarations: [PDFComponent],
  exports: [PDFComponent],
})
export class PDFModule {}
