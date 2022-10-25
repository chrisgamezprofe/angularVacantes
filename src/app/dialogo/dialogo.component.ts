import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Empresa } from '../interfaces/empresa';
import { MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ɵInjectableAnimationEngine } from '@angular/platform-browser/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.scss']
})
export class DialogoComponent implements OnInit {
  titulo="Registrar nueva empresa"
  textoBoton="Guardar"
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  res: any;
  empresas:Empresa[]=[];
  cargando = false;
  empresaForm!: FormGroup;
  imagen:any
  imagen_logo=new FormControl('');
  ciudad = new FormControl('', Validators.required);
  correo = new FormControl('', [Validators.required, Validators.pattern("[^ @]*@[^ @]*")]);
  nombre = new FormControl('', [Validators.required, Validators.minLength(5)]);
  ciudades: string[] = ['Medellín', 'Bogotá', 'Manizales'];
  sino: boolean[] = [true, false];
  verificada: boolean = false;

  constructor(private formBuilder: FormBuilder, private api: ApiService,@Inject(MAT_DIALOG_DATA) public editData:any, private _snackBar: MatSnackBar,private dialogoRef:MatDialogRef<DialogoComponent>) {

  }

  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = e => this.imagen = reader.result;
        reader.onloadend = e => this.imagen_logo.setValue(reader.result as string);
        reader.readAsDataURL(file);
        
    }
}

  ngOnInit() {
    this.empresaForm = this.formBuilder.group({
      nombre: this.nombre,
      nit: ['', Validators.required],
      ciudad: this.ciudad,
      telefono: ['', Validators.required],
      correo: this.correo,
      verificada: ['', Validators.required],
      imagen_logo: this.imagen_logo,
    });

    if(this.editData){
      this.titulo="Editar empresa "+this.editData.nombre
      this.textoBoton="Guardar cambios"
      this.empresaForm.get('nombre')?.setValue(this.editData.nombre);
      this.empresaForm.get('nit')?.setValue(this.editData.nit);
      this.empresaForm.get('correo')?.setValue(this.editData.correo);
      this.empresaForm.get('telefono')?.setValue(this.editData.telefono);
      this.empresaForm.get('verificada')?.setValue(this.editData.verificada);
      this.empresaForm.get('ciudad')?.setValue(this.editData.ciudad);
      this.imagen=this.editData.imagen_logo;
    }

  }

  deshabilitado=true

  habilitarBoton(){
    this.deshabilitado=!this.empresaForm.valid
  }


  

  guardar() {

    if (this.empresaForm.valid) {
      this.cargando = true;
      this.api.post(this.empresaForm.value)
        .subscribe({
          next: (response) => {
            if (response['error']) {
              this._snackBar.open(response['message'], 'Cerrar', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
            } else {
              this._snackBar.open("Empresa registrada", 'Cerrar', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
              });
              Swal.fire("Empresa registrada","Empresa registrada con exito en el sistema","success");

            }
            this.cargando = false;
            this.empresaForm.reset()
            this.dialogoRef.close('guardar')
          },
          error: (err: HttpErrorResponse) => {
            let msg = (err.status == 409) ? "Ya existe una empresa con nit:" + this.empresaForm.get("nit")?.value : err.message
            this._snackBar.open(msg, "Cerrar", {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            Swal.fire("Upps",msg,"error");
            this.cargando = false;
          }
        })

    }

  }

}



