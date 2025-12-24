import { FormControl,FormGroup,Validators } from "@angular/forms";
import { UpdateCategoryRequestModel } from "../../Models/Categories/UpdateCategoryRequestModel";
import { baseCategoryForm } from "./BaseCategoryFormFactory";

export type UpdateCategoryForm=FormGroup<{
    id:FormControl<number>;
    name:FormControl<string>;
    description:FormControl<string>;
    
}>;

export function updateCategoryForm(){
    const base = baseCategoryForm();

    //#region

    /**
     * create te dikkat ederseniz maxlength yok. update te validation logic degisebilir.
     *  ayni formcontrol yapisina ek validator eklemek isteyebiliriz
     * 
     * bu inheritance degil
     * override da degil
     * 
     * behaviour composition (davranis birlestirmek)
     */

    //#endregion


    base.name.addValidators([Validators.maxLength(50)]);

    base.name.updateValueAndValidity({emitEvent:false});
    base.name.updateValueAndValidity({emitEvent:false});

    /**
     * updateValueAndValidity({emitEvent:false}) anlami:
     *      validator set i arti degisti angular a kendini tekrar bi validate et
     *      emitevent:false =>> valueChanges tekrar tetiklenmesin diye
     * 
     *      Aksi halde form acildigi zaman ui da gereksiz validation event leri olur
     */


    return new FormGroup({
        id:new FormControl(0,{
            nonNullable:true,
            validators:[Validators.required,Validators.min(1)],
        }),
        ...base,
    });
}

    export function toUpdateCategoryRequest(form: UpdateCategoryForm): UpdateCategoryRequestModel {
        return {
          id: form.controls.id.value,
          categoryName: form.controls.name.value,
          description: form.controls.description.value,
        };
      }