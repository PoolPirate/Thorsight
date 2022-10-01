import { EventEmitter, Input, Output } from "@angular/core";
import { Component } from "@angular/core";


@Component({
  selector: 'navlink-component',
  templateUrl: './navlink.component.html',
  styleUrls: ['./navlink.component.scss']
})
export class NavLinkComponent {
  @Input()
  pushdown: boolean = false;

  @Input()
  route: string = "";
}
