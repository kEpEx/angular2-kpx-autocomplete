import { Component, Input, Output, EventEmitter, SimpleChanges, forwardRef } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AutocompleteItem, SelectedAutocompleteValue } from './models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({ 
    selector: 'tesla-autocomplete',
    styles: [`.autocomplete-selected { background-color: blue; }`],
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => kpxAutocomplete), multi: true},
    ],
    template: './kpx-autocomplete.html'
 })
export class kpxAutocomplete implements ControlValueAccessor {
    @Input('text-value') textValue :string;
    @Input('key-value') keyValue :string;
    @Input('data-property') dataPropertyName :string = "";

    @Input('api-url') apiURL :string;
    @Input('id-field') nameIDField :string;
    @Input('description-field') nameDescriptionField :string;

    @Output('onSelect') onSelect: EventEmitter<string> = new EventEmitter<string>();
    

    private selected :SelectedAutocompleteValue;
    
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
            .get(`${this.apiURL}?search=${search}`)
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

    onKeyUp(event: KeyboardEvent) {
        this.showList=true;
        var key = event.keyCode;
        if(key == 38 || key == 40 || key == 13) {
            if(key == 13) {
                
                this.doSelectIndex(this.indexSelected);

                this.showList = false;
                event.preventDefault();
            }
            else {
                if(key == 40) this.indexSelected++;
                else this.indexSelected--;
                this.refreshSelected();
            }
        }
        else {
            let val = (<HTMLInputElement>event.target).value;
            this.fetch(val);
        }
        
    }

    doSelectIndex(index:number):void {
        this.indexSelected = index;
        this.selected.Description = this.list[this.indexSelected].Name;
        this.selected.Value = this.list[this.indexSelected].ID;

        this.keyValue = this.selected.Value;
        this.onChange(this.keyValue);
        this.onSelect.emit(this.keyValue);
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

        console.log("Click on: "+item.Name+", index: "+index);
        this.indexSelected = index;
        this.refreshSelected();

        this.doSelectIndex(this.indexSelected);
        this.dontBlur = false;

    }

     /** Implemented as part of ControlValueAccessor. */
    onChange: (value:any) => any = () => { };

    onTouched: () => any = () => { };

    writeValue(value: any) {
        if(value == undefined) this.selected.Description = "";
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