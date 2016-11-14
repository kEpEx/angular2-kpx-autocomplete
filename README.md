# angular2-kpx-autocomplete

[![npm version](https://badge.fury.io/js/angular2-kpx-autocomplete.svg)](https://badge.fury.io/js/angular2-kpx-autocomplete)
[![downloads](https://img.shields.io/npm/dm/angular2-kpx-autocomplete.svg)](https://www.npmjs.com/package/angular2-kpx-autocomplete)

Angular2 Typescript Autocomplete

Simple autocomplete to filter server side results, you will get the ID property on your model.

## Installation

```
npm install angular2-kpx-autocomplete -S
```

## Configuration
In your **app.module.ts**

```
import { kpxAutocompleteModule } from 'angular2-kpx-autocomplete/kpx-autocomplete';
```
Add the module to the imports array: `kpxAutocompleteModule`

Enjoy!

## Use
Example of use:

```
  <kpx-autocomplete  
      [api-url]="'http://localhost/test/list.php'"
      [id-field]="'ID'"
      [description-field]="'Name'"
      [(ngModel)]="yourModelProperty" 
      name="nameOfControl"
  >
  </kpx-autocomplete>
```

## Backend

A parameter 'search' will be sent with the input in the GET, you can use to filter on the backend. I recommend to limit to 10 results.

## Options


- `[data-property]="'Data'"`  -- In case you wrap the array of result objects in the `Data` property
- `[(text-value)]="Selected"` -- In case you want to put a predefined text on the input




Let me know if you have any questions or if you find this library useful at twitter @[kEpEx](https://twitter.com/kepex)