import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CmsPDFComponent } from '@spartacus/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CmsComponentData } from '../../../cms-structure/page/model/cms-component-data';

@Component({
  selector: 'cx-pdf',
  templateUrl: './pdf.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PDFComponent implements OnInit {

  title: string | undefined;
  testFunc(data: CmsPDFComponent) {
    console.log(data);
    this.title = data.title;
  }

  data$: Observable<CmsPDFComponent> = this.component.data$.pipe(
    tap((data) => {
      console.log(data);
      this.testFunc(data);
    })
  );
  constructor(
    protected component: CmsComponentData<CmsPDFComponent>
  ) {}

  ngOnInit(): void {}
}
