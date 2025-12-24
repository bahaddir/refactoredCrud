import { FormGroup } from "@angular/forms";
import { CreateProductRequestModel } from "../../Models/Products/CreateProductRequestModel";
import { baseProductForm } from "./BaseProductFormFactory";

export type CreateProductForm=FormGroup<ReturnType<typeof baseProductForm>>;

export function createProductForm():CreateProductForm{
    return new FormGroup(baseProductForm());
}

export function toCreateProductRequest(form:CreateProductForm):CreateProductRequestModel{
    return{
        productName:form.controls.productName.value,
        unitPrice:form.controls.unitPrice.value,
        categoryId:form.controls.categoryId.value,
    }
}





