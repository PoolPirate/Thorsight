import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {
  addressControl: FormControl = new FormControl("", [Validators.required]);

  constructor(private router: Router) { }

  analyze() {
    this.addressControl.markAllAsTouched();

    if (this.addressControl.invalid) {
      return;
    }

    const address = this.addressControl.value;
    this.router.navigate([address]);
  }
}
