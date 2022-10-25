import { HttpErrorResponse } from '@angular/common/http';
import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ɵInjectableAnimationEngine } from '@angular/platform-browser/animations';
import { DialogoComponent } from './dialogo/dialogo.component';
import { Empresa } from './interfaces/empresa';
import { ApiService } from './services/api.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  title = 'vacantes';
  cargando=false;
  empresas:Empresa[]=[];

  constructor(private dialogo:MatDialog,private api: ApiService, private _snackBar: MatSnackBar){

  }

  ngOnInit() {
    this.getEmpresas();
  }

  ngAfterViewInit() {
    this.datos.paginator = this.paginator;
    this.datos.sort = this.sort;
  }

  displayedColumns: string[] = ['imagen_logo','id', 'nit', 'nombre', 'ciudad',  'telefono', 'correo', 'verificada','acciones'];
  datos!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datos.filter = filterValue.trim().toLowerCase();
  }

  edit(row:any){
    this.dialogo.open(DialogoComponent,{
      width:'50%',
      data:row
    })
  }
  
  getEmpresas() {
    this.cargando = true;
    this.api.getEmpresas()
      .subscribe({
        next: response => {
          this.datos = new MatTableDataSource(response);
          this.datos.paginator=this.paginator;
          this.cargando = false;
          console.log(this.datos)
          this._snackBar.open("Lista de empresas completa", "Cerrar", {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        },
        error: (err: HttpErrorResponse) => {
          this._snackBar.open("No se logró cargar las empresas", "Cerrar", {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.cargando = false;
        }
      })

}


  abrirFormularioRegistro(): void {
    const dialogRef = this.dialogo.open(DialogoComponent, {
      width: '40%',
    });
  }

}
