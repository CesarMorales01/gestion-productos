import React from 'react'
import DialogoCompraN from './DialogoCompraN';
import DialogoEliminar from '../IUGeneral/DialogoEliminar';
import Cargando from '../IUGeneral/Cargando'
import GlobalFunctions from '../../services/GlobalFunctions'
import { useState, useEffect } from 'react';

const TablaListaCompras = (params) => {

    const [lista, setLista] = useState([])
    const glob= new GlobalFunctions()
    const optionsSelect = [
      { value: 'Recibida', label: 'Recibida' },
      { value: 'Preparando', label: 'Preparando' },
      { value: 'En camino', label: 'En camino' },
      {value: 'Entregada', label: 'Entregada'}
    ]
    const [cargarNCompra, setCargarNCompra] = useState(0)
    const [datosCompra, setDatosCompra] = useState({})
    const [idBorrar, setIdBorrar] = useState({
        id: 0,
        compra_n: '',
        cliente: ''
    })

    useEffect(() => {
        if(params.lista.length!==lista.length){
            setLista(params.lista)
        }   
    })

    function loadingOn(id){
        document.getElementById(id).style.display='none'
        document.getElementById('btnLoadingSelect'+id).style.display='inline'
    }

    function abrirCompraN(item){
        setDatosCompra(item)
        setCargarNCompra(cargarNCompra+1)
    }

    function cambioEstado(estado){
        loadingOn(estado.target.id)
        const url = glob.URL_SERV+"get_compras.php?modo=cambioEstado&id="+estado.target.id+'&estado='+estado.target.value
          fetch(url).then((response) => {
            return response.json()
          })
          .then((json) => {
            if(json.length>0){
               document.getElementById('inputCambioEstado').click()
            }
        })
    }

    function fetchBorrar(){
        loadingOn(idBorrar.id)
        document.getElementById('btnDialogoEliminar').click()
        const url = glob.URL_SERV+"get_compras.php?modo=borrarCompra&id="+idBorrar.id+'&compraN='+idBorrar.compra_n+'&cliente='+idBorrar.cliente
        fetch(url).then((response) => {
            return response.json()
          })
          .then((json) => {
            document.getElementById('inputFetchCompras').click()
          })
    }
    
    function confirmarEliminar(item){
        setIdBorrar({
          id: item.id,
          compra_n: item.compra_n,
          cliente: item.cliente
        })
        document.getElementById('btnDialogoEliminar').click()
      }
    
  return (
    <div>
        <input type={'hidden'} id='inputFetchCompras' onClick={()=>params.fetchCompras('Compra eliminada!')}></input>
        <input type={'hidden'} id='inputCambioEstado' onClick={()=>params.fetchCompras('Cambio estado de compra!')}></input>
         <table className="table table-striped">
              <thead>
                      <tr>
                      <th scope="col">Fecha</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">N° Compra</th>
                        <th scope="col">Total compra</th>
                        <th scope="col">Costo envio</th>
                        <th scope="col">Medio pago</th>
                        <th scope="col">Comentarios</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Acciones</th>
                      </tr>
              </thead>
              <tbody>
              {lista.map((item, index)=>{
                return(
                  <tr key={index}>
                    <th scope="row">
                      {item.fecha}
                    </th>
                    <td>{item.periodicidad}</td>
                    <td>
                      <button id='btnCompraN' onClick={()=>abrirCompraN(item)} className='btn btn-outline-dark rounded' type="button" data-toggle="modal" data-target="#dialogoCompraN"> 
                        <svg style={{marginRight: '0.2em'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                        </svg>
                        {item.compra_n}  
                      </button>
                    </td>
                    <td>{glob.formatNumber(item.total_compra)}</td>
                    <td>{item.domicilio}</td>
                    <td>{item.medio_de_pago}</td>
                    <td>{item.comentarios}</td>
                    <td> 
                      <div style={{width: '8em'}}>
                        <select onChange={cambioEstado} id={item.id} value={item.estado} className="form-select form-select-sm">
                          {optionsSelect.map((opcion, index)=>{
                            return(
                              <option key={index} value={opcion.label}>{opcion.label}</option>
                            ) 
                          })}
                      </select>
                      <button id={'btnLoadingSelect'+item.id} style={{display:'none', backgroundColor:'gray'}} className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                      </button>
                      </div>
                    </td>
                    <td>
                      <span onClick={()=>{confirmarEliminar(item)}} className='btn btn-danger btn-sm border border-dark rounded cursorPointer' style={{marginLeft: '0.2em', padding: '0.2em'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                      </span>
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </table>
            <DialogoCompraN datos={datosCompra} cargarNCompra={cargarNCompra}/>
             {/* dialogo eliminar*/}
             <button  type="button" id='btnDialogoEliminar' data-bs-toggle="modal"  data-bs-target="#dialogoEliminar" style={{display:'none'}}></button>
             <DialogoEliminar display={'inline'} accion={fetchBorrar} titulo={'Eliminar esta compra?'} textoConfirmar={'Confirmar'}/>     
    </div>
  )
}

export default TablaListaCompras