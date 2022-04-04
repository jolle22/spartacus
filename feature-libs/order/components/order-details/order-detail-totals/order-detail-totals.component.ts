import { Component, OnInit } from '@angular/core';
import { CartOutlets } from '@spartacus/cart/base/root';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OrderDetailsService } from '../order-details.service';

@Component({
  selector: 'cx-order-details-totals',
  templateUrl: './order-detail-totals.component.html',
})
export class OrderDetailTotalsComponent implements OnInit {
  constructor(protected orderDetailsService: OrderDetailsService) {}

  order$: Observable<any>;

  readonly CartOutlets = CartOutlets;

  ngOnInit() {
    this.order$ = this.orderDetailsService.getOrderDetails().pipe(
      filter((order) => !!order),
      map((order) => (Object.keys(order).length ? order : null))
    );
  }
}
