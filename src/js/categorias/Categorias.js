import React from 'react'
import { useState, useEffect } from 'react';
import Cargando from '../IUGeneral/Cargando';
import DialogoEliminar from '../IUGeneral/DialogoEliminar';
import GlobalFunctions from '../../services/GlobalFunctions'
import NuevaCategoria from './NuevaCategoria';

const Categorias = (params) => {
  const glob= new GlobalFunctions()
  const [categorias, setCategorias] = useState([])
  const [message, setMessage] = useState('')
  const [cate, setCate] = useState({
    id: '',
    nombre: '',
    imagen: ''
  })

  useEffect(() => {
    if(params.categorias.length!=categorias.length){
      setCategorias(params.categorias)
    }
  })

function borrarCate(cod, nombre, imagen){
  setCate({
    id: cod,
    nombre: nombre,
    imagen: imagen
  })
  document.getElementById('btnDialogoEliminar').click()  
}  

function validarProductosConCategoria(){
  let existe=false
  for(let i=0; i<params.productos.length; i++){
    if(params.productos[i].categoria==cate.nombre){
      existe=true
    }
  }
  return existe
}

function fetchBorrar(){
  if(validarProductosConCategoria()){
     alert('Esta categoria esta asignada a productos!')
     document.getElementById('btnDialogoEliminar').click() 
  }else{
    document.getElementById('btnDialogoEliminar').click()  
    document.getElementById('loadingCategoria').style.display='inline'
    const url = glob.URL_SERV+'get_categorias.php?code=borrarCate&id='+cate.id+'&imagen='+cate.imagen
    fetch(url).then((response) => {
      return response.json()
    })
    .then((json) => {
        if(json.baseDatos=='Categoria borrada' && json.directorio=='Imagen eliminada'){
          document.getElementById('loadingCategoria').style.display='none'
          document.getElementById('inputReiniciarCates').click()
          setMessage('Categoria eliminada!') 
        }else{
          setMessage('Problemas al eliminar la categoria!')
        }
    })
  }
}

function reiniciarCategorias(){
   document.getElementById('btnNuevaCategoria').click()
   document.getElementById('inputReiniciarCates').click()
   setMessage('Nueva categoria!')
}

if(categorias.length>0){
    return (
      <div className='container table-responsive'>
         <input type='hidden' id='inputReiniciarCates' onClick={params.reiniciarCategorias}/>
         <div style={{marginTop: '0.2em'}} align="center" className="row justify-content-center">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12" >
              <button type="button" id='btnNuevaCategoria'  style={{backgroundColor: '#f0e094', color: 'black'}} className='btn btn-primary btn-sm' data-toggle="modal" data-target="#dialogoNuevaCategoria">
                Nueva categoria
              </button>  
            </div>
            <div style={{marginTop: '0.2em'}} className="col-lg-6 col-md-6 col-sm-12 col-12" >
              <span id='loadingCategoria' style={{display: 'none'}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span style={{color: 'red'}}>{message}</span>            
          </div>  
        </div>
        <table className="table table-striped">
          <thead>
                  <tr>
                    <th scope="col">Codigo</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Imagen</th>
                  </tr>
          </thead>
          <tbody>
          {categorias.map((item, index)=>{
            return(
              <tr key={index}>
                <th scope="row">
                  {item.codigo}
                  <br/>
                  <span onClick={()=>borrarCate(item.codigo, item.nombre, item.imagen)} className='border border-dark rounded cursorPointer' style={{padding: '0.2em', backgroundColor: '#f0e094'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                  </span>
                </th>
                <td>{item.nombre}</td>
                <td>{item.imagen}
                <br/>
                <img style={{width: '6em', heigth: '6em'}} src={process.env.REACT_APP_URL_IMAGES+item.imagen} />
                {/* dialogo eliminar*/}
                <span  type="button" id='btnDialogoEliminar' data-bs-toggle="modal"  data-bs-target="#dialogoEliminar" style={{display:'none'}}></span>
                <DialogoEliminar display={'inline'} accion={fetchBorrar} titulo={'Eliminar esta categoria?'} textoConfirmar={'Confirmar'}/>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
        <NuevaCategoria reiniciarCategorias={reiniciarCategorias}/> 
    </div>
    )
  }else{
    return(
      <Cargando />
    )
  }
}

export default Categorias