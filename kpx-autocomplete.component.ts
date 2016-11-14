import { Component, Input, Output, EventEmitter, SimpleChanges, forwardRef } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs';
import { AutocompleteItem, SelectedAutocompleteValue } from './models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import 'rxjs/add/operator/toPromise';

@Component({ 
    selector: 'kpx-autocomplete',
    styles: [`
        .kpx-autocomplete-main {
            position: relative;
        }


        .kpx-autocomplete-main  .menu {
            min-width: 190px;
            padding: 12px 0;
            box-shadow: 0 9px 20px rgba(0, 0, 0, 0.25);
            position: absolute;
            top: 100%;
            left: 0;
            background: #fff;
            z-index: 1000;
            max-height: 350px;
            overflow: auto;
        }

        .kpx-autocomplete-main  .col .menu {
            width: 100%;
        }

        .kpx-autocomplete-main  .menu-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .kpx-autocomplete-main  .menu-list-item {
            font-size: 14px;
            color: #0c0c0c;
            padding: 6px 20px;
        }

        .kpx-autocomplete-main  .menu-list-item.selected {
            font-weight: bold;
            background-color: #f2f4f6;
        }

        .kpx-autocomplete-main .menu-list-item:hover {
            background: #f2f4f6;
        }

    `],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => kpxAutocompleteComponent), multi: true},
    ],
    templateUrl: './kpx-autocomplete.component.html'
 })
export class kpxAutocompleteComponent implements ControlValueAccessor {
    @Input('text-value') 
    set _textValue(value:any){
        this.selected.Description = value;
    }

    @Input('key-value') keyValue :string;
    @Input('data-property') dataPropertyName :string = "";
    @Input('param-get-search') paramGetSearch :string = "search";

    

    @Input('api-url') apiURL :string;
    @Input('id-field') nameIDField :string;
    @Input('description-field') nameDescriptionField :string;
    @Input('min-chars') minChars :number = 1;
    @Input('placeholder') placeholder :string = "";

    @Output('onSelect') onSelect: EventEmitter<string> = new EventEmitter<string>();
    

    private selected :SelectedAutocompleteValue;
    
    private firstSet = true;
    private list :AutocompleteItem[];
    private showList :boolean = false;
    private indexSelected :number;
    private idSelected :string;

    private dontBlur = false;
    
    constructor(public http: Http) {
        this.list = [];
        this.selected = new SelectedAutocompleteValue();
    }

    ngOnInit(): void { 
        
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes['textValue']) {
            this.selected.Description = changes['textValue'].currentValue;
        }
        if(changes['keyValue']) {
            this.selected.Value = changes['keyValue'].currentValue;
        }
    }
  

    fetch(search:string):void {
        this.indexSelected = 0;
         this.http
            .get(`${this.apiURL}?${this.paramGetSearch}=${search}`)
            .toPromise()
            .then((response:any) => {
                let ret = response.json();
                let jsonret = this.dataPropertyName != '' ? ret[this.dataPropertyName] : ret;
                this.list = jsonret.map(
                        (d:any)=>{ 
                                return { ID: d[this.nameIDField], Name: d[this.nameDescriptionField] };
                             }
                        );
                if(this.list.length > 0) 
                    this.list[0].Selected = true;
            });
    }

    onFocus() {
        this.showList = true;
    }

    onBlur() {
        setTimeout(()=> {
            if(!this.dontBlur)
                this.showList = false;
        }, 200);
    }

    onKeyDown(event: KeyboardEvent) {
        var key = event.keyCode;
        if(key == 13) {
            this.doSelectIndex(this.indexSelected);
            this.showList = false;
            event.preventDefault();
        }
    }

    onKeyUp(event: KeyboardEvent) {
        this.showList=true;
        var key = event.keyCode;
        if(key == 38 || key == 40 || key == 13) {
            if(key == 13) {
                this.showList = false;
            }
            else {
                if(key == 40) this.indexSelected++;
                else this.indexSelected--;
                this.refreshSelected();
            }
        }
        else {
            let val = (<HTMLInputElement>event.target).value;
            if(val.length >= this.minChars)
                this.fetch(val);
        }
        
    }

    doSelectIndex(index:number):void {
        this.indexSelected = index;
        //this.selected.Description = `${this.list[this.indexSelected].ID} - ${this.list[this.indexSelected].Name}`;
        this.selected.Description = `${this.list[this.indexSelected].Name}`;
        this.selected.Value = this.list[this.indexSelected].ID;

        this.keyValue = this.selected.Value;
        this.onChange(this.keyValue);
        this.onSelect.emit(this.keyValue);

        this.firstSet = false;
    }

    refreshSelected():  void {
        this.list = this.list.filter((d, i)=> {
            if(i == this.indexSelected) d.Selected = true;
            else  d.Selected = false;
            return d;
        });
    }

    onClickOption(item:AutocompleteItem, index:number):void {        
        this.dontBlur = true;

        this.indexSelected = index;
        this.refreshSelected();

        this.doSelectIndex(this.indexSelected);
        this.dontBlur = false;
    }

     /** Implemented as part of ControlValueAccessor. */
    onChange: (value:any) => any = () => {
        
     };

    onTouched: () => any = () => { };

    writeValue(value: any) {
        if(!this.firstSet && (value == undefined || value == null || value == 0 )) { //this.selected.Description = ""; }
            console.log(this.selected);
            this.selected.Description = "";
            this.firstSet = false;
        } 
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    ngOnDestroy() {
        
    }

}