import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ThorValidators } from "../../../shared/validators/ThorValidators";

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  addressControl: FormControl = new FormControl("", [Validators.required, ThorValidators.address]);

  constructor(private router: Router) { }

  analyze() {
    this.addressControl.markAllAsTouched();

    if (this.addressControl.invalid) {
      return;
    }

    const address = this.addressControl.value.trim();
    this.router.navigate([address]);
  }
}
