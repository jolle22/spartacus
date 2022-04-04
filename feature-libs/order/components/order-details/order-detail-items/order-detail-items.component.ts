import { Component, OnInit } from '@angular/core';
import { CartOutlets, PromotionLocation } from '@spartacus/cart/base/root';
import { Consignment, Order } from '@spartacus/order/root';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { OrderDetailsService } from '../order-details.service';
import {
  cancelledValues,
  completedValues,
} from './order-consigned-entries/order-consigned-entries.model';

@Component({
  selector: 'cx-order-details-items',
  templateUrl: './order-detail-items.component.html',
})
export class OrderDetailItemsComponent implements OnInit {
  constructor(protected orderDetailsService: OrderDetailsService) {}

  readonly CartOutlets = CartOutlets;

  promotionLocation: PromotionLocation = PromotionLocation.Order;
  order$: Observable<Order | null> = this.orderDetailsService
    .getOrderDetails()
    .pipe(
      filter((order) => !!order),
      map((order) => (Object.keys(order).length ? order : null))
    );
  others$: Observable<Consignment[] | undefined>;
  completed$: Observable<Consignment[] | undefined>;
  cancel$: Observable<Consignment[] | undefined>;
  error$: Observable<boolean> = this.orderDetailsService
    .getOrderDetailState()
    .pipe(map((state) => !!state.error));

  ngOnInit() {
    this.others$ = this.getOtherStatus(...completedValues, ...cancelledValues);
    this.completed$ = this.getExactStatus(completedValues);
    this.cancel$ = this.getExactStatus(cancelledValues);
  }

  private getExactStatus(
    consignmentStatus: string[]
  ): Observable<Consignment[] | undefined> {
    return this.order$.pipe(
      map((order) => {
        if (Boolean(order?.consignments)) {
          return order?.consignments?.filter(
            (consignment) =>
              consignment.status &&
              consignmentStatus.includes(consignment.status)
          );
        }
      })
    );
  }

  private getOtherStatus(
    ...consignmentStatus: string[]
  ): Observable<Consignment[] | undefined> {
    return this.order$.pipe(
      map((order) => {
        if (Boolean(order?.consignments)) {
          return order?.consignments?.filter(
            (consignment) =>
              consignment.status &&
              !consignmentStatus.includes(consignment.status)
          );
        }
      })
    );
  }
}
