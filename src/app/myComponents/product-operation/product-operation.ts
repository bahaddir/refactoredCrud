import { Component,signal,inject,OnInit } from '@angular/core';
import { AbstractControl,ReactiveFormsModule } from '@angular/forms';
import { ProductApi } from '../../DataAccess/product-api';
import { ProductResponseModel } from '../../Models/Products/ProductResponseModel';
import { createProductForm, CreateProductForm,toCreateProductRequest } from '../../Validations/Products/CreateProductFormFactory';
import { updateProductForm,toUpdateProductRequest } from '../../Validations/Products/UpdateProductFormFactory';

@Component({
  selector: 'app-product-operation',
  imports: [ReactiveFormsModule],
  templateUrl: './product-operation.html',
  styleUrl: './product-operation.css',
})
export class ProductOperation {
  private productApi=inject(ProductApi);
  protected products=signal<ProductResponseModel[]>([]);
  protected selectedProduct=signal<ProductResponseModel|null>(null);

  protected createForm=createProductForm();
  protected updateForm=updateProductForm();

  private async refreshProducts():Promise<void>{
    try {
      const values=await this.productApi.getAll();
      this.products.set(values);
    } catch (error) {
      console.log("product listesi alnanmadi",error);
    }
  }

  async ngOnInit():Promise<void>{
    await this.refreshProducts();
  }

  //create

  async onCreate():Promise<void>{
    if(this.createForm.invalid){
      this.createForm.markAllAsTouched();
      return;
    }

    const req = toCreateProductRequest(this.createForm);
    await this.productApi.create(req);
    this.createForm.reset();
    await this.refreshProducts();
  }

  //update
  
  startUpdate(prod:ProductResponseModel){
    this.selectedProduct.set(prod);
    this.updateForm.patchValue({
      id:prod.id,
      productName:prod.productName,
      unitPrice:prod.unitPrice,
      categoryId:prod.categoryId,
    },
    {emitEvent:false}
    );
  }

  cancelUpdate(){
    this.selectedProduct.set(null);
    this.updateForm.reset({id:0,productName:'',unitPrice:0,categoryId:0,});
  }

  async onUpdate(){
    if(this.updateForm.invalid){
      this.updateForm.markAllAsTouched();
      return;
    }
    const req=toUpdateProductRequest(this.updateForm);
    await this.productApi.update(req);
    this.cancelUpdate();
    await this.refreshProducts();
  }

  //delete

  async onDelete(id:number):Promise<void>{
    const confirmDelete=window.confirm(
      `id si ${id} olan product i silmek istediginize emin misiniz?`
    );
    if(!confirmDelete) return;

    try {
      const message=await this.productApi.deleteById(id);
      console.log('delete mesaji',message);

      this.products.update((x)=>x.filter((c)=>c.id!==id));

      const selected=this.selectedProduct();
      if(selected&&selected.id===id){
        this.selectedProduct.set(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  protected labels:Record<string,string>={
    productName:'urun adi',
    unitPrice: 'birim fiyat',
    categoryId:'category id',
    id:'ID',
  };


  protected getErrorMessage(control:AbstractControl|null,label='bu alan'): string | null {
    if(!control||(!control.touched && !control.dirty)) return null;
    else if(control.hasError('required')) return `${label} zorunludur`;
    else if(control.hasError('minlength')) {
      const e = control.getError('minlength'); //requiredlength, actuallength
      return `${label} en az ${e.requiredLength} karakter olmalidir`;
    }
    else if(control.hasError('maxlength')){
      const e = control.getError('maxlength');
      return `${label} en fazla ${e.requiredLength} karakter olmalidir`;
    }
    //return `${label} gecersiz`;
    return null;
  }

  protected getErrorMessageByName(form:{controls:Record<string,AbstractControl>},controlName:string):string|null{
    const control = form.controls[controlName];
    const label=this.labels[controlName]??controlName;

    return this.getErrorMessage(control,label);
  }


  


}
