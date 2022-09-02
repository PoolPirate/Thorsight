import { EventEmitter, Output } from "@angular/core";
import { Component } from "@angular/core";


@Component({
  selector: 'nav-component',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  @Output()
  public drawerToggle: EventEmitter<void> = new EventEmitter();

  emitDrawerToggle() {
    this.drawerToggle.emit();
  }
}
