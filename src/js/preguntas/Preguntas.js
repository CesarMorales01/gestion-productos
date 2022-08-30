import React from 'react'
import Cargando from '../IUGeneral/Cargando'
import GlobalFunctions from '../../services/GlobalFunctions'
import { useState, useEffect } from 'react';
import DialogoEliminar from '../IUGeneral/DialogoEliminar';

const Preguntas = () => {
    const glob= new GlobalFunctions()
    const [preguntas, setPreguntas] = useState([])
    const [idBorrar, setIdBorrar] = useState(0)

    useEffect(() => {
        if(preguntas.length==0){
          fetchPreguntas()
        }
    }, [preguntas])

    function fetchPreguntas(){
        const url = glob.URL_SERV+"getPreguntas.php?modo=getAll"
        fetch(url).then((response) => {
            return response.json()
        })
        .then((json) => {
            if(json.length==0){
                setListaCero()
            }else{
                setPreguntas(json)
            } 
        })
    }

    function setListaCero(){ 
        const objeto={'nombre': ''}
        const arrayNombre=[]
        arrayNombre.push(objeto)
              const obj={
                fecha: '',
                vendedor: 'No hay preguntas registradas',
                estado: '',
                total_compra: arrayNombre,
                descripcion_credito: '',
                comentarios: ''
              }
        const array = []
        array.push(obj)
        setPreguntas(array)
    }

    function loadingOn(id){
        document.getElementById('btnEditar'+id).style.display='none'
        document.getElementById('btnLoading'+id).style.display='inline'
    }

    function loadingOff(id){
        document.getElementById('btnEditar'+id).style.display='inline'
        document.getElementById('btnLoading'+id).style.display='none'
    }

    function fetchRespuesta(id){
        loadingOn(id)
        const respuesta= document.getElementById(id).value
        const url = glob.URL_SERV+"getPreguntas.php?modo=responderPregunta&id="+id+"&respuesta="+respuesta
        fetch(url).then((response) => {
            return response.json()
        })
        .then((json) => {
            loadingOff(id)
            if(json.length>0){
               setPreguntas(json)
            }
        })
    }

    function dialogoBorrar(id){
        setIdBorrar(id)
        document.getElementById('btnDialogoEliminar').click()
    }

    function fetchBorrar(){
        document.getElementById('btnDialogoEliminar').click()
        loadingOn(idBorrar)
        const url = glob.URL_SERV+"getPreguntas.php?modo=borrarPregunta&id="+idBorrar
        fetch(url).then((response) => {
            return response.json()
        })
        .then((json) => {
            loadingOff(idBorrar)
            if(json.length>0){
               setPreguntas(json)
            }else{
                setListaCero()
            }
        })
    }

    if(preguntas.length>0){
        return (
            <div className='container table-responsive'>
                    <table className="table table-striped">
                      <thead>
                              <tr>
                                <th scope="col">Fecha</th>
                                <th scope="col">Cliente</th>
                                <th scope="col">Producto</th>
                                <th scope="col">Pregunta</th>
                                <th scope="col">Respuesta</th>
                              </tr>
                      </thead>
                      <tbody>
                      {preguntas.map((item, index)=>{
                            return(
                            <tr key={index}>
                                <th scope="row">
                                {item.fecha}
                                <br/>
                                <button id="btnBorrar"  onClick={()=>dialogoBorrar(item.id)} className="btn btn-danger" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                    </svg>
                                </button>
                                </th>
                                <td>{item.vendedor}
                                    <br/>
                                    {item.estado}
                                </td>
                                <td>{item.total_compra[0].nombre}
                                </td>
                                <td>{item.descripcion_credito}</td>
                                <td>
                                    <textarea id={item.id} placeholder='Escribe una respuesta' defaultValue={item.comentarios} rows='1'></textarea>
                                    <br/>
                                    <button id={'btnEditar'+item.id} onClick={()=>fetchRespuesta(item.id)} className="btn btn-success" type="button">{item.comentarios=='' ? 'Responder' : 'Editar'}</button>
                                    <button id={'btnLoading'+item.id} style={{display:'none', backgroundColor:'gray'}} className="btn btn-primary" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </button>
                                </td>
                            </tr>
                            )
                        })}
                      </tbody>
                    </table> 
                    {/* dialogo eliminar*/}
                    <button  type="button" id='btnDialogoEliminar' data-bs-toggle="modal"  data-bs-target="#dialogoEliminar" style={{display:'none'}}></button>
                    <DialogoEliminar display={'inline'} accion={fetchBorrar} titulo={'Eliminar este pregunta?'} textoConfirmar={'Confirmar'}/>
                </div>
          )
    }else{
        return(
            <Cargando />
        )
    }

}

export default Preguntas