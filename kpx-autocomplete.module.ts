import {NgModule} from '@angular/core'
import { HttpModule } from '@angular/http';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { kpxAutocompleteComponent } from './kpx-autocomplete.component';


@NgModule({
  declarations: [kpxAutocompleteComponent],
  imports     : [BrowserModule, HttpModule, FormsModule, ReactiveFormsModule],
  providers   : [],
  bootstrap   : [kpxAutocompleteComponent],
  exports: [kpxAutocompleteComponent]
})
export class kpxAutocompleteModule {

}
