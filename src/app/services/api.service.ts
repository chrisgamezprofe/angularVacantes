import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Empresa } from '../interfaces/empresa';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  post(data:any){
    return this.http.post<any>(environment.URLAPIEMPRESA,data);
  }

  addEmpresa(empresa:Empresa):Observable<Empresa>{
    return this.http.post<Empresa>(environment.URLAPIEMPRESA,empresa);
  }

  getEmpresas():Observable<Empresa[]>{
    return this.http.get<Empresa[]>(environment.URLAPIEMPRESA);
  }

  get(){
    return this.http.get<any>(environment.URLAPIEMPRESA);
  }
}
