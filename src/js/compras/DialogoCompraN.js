import React from 'react'
import { useState, useEffect } from 'react';
import Cargando from "../IUGeneral/Cargando";
import GlobalFunctions from '../../services/GlobalFunctions'

const DialogoCompraN = (params) => {
    const glob= new GlobalFunctions()
    const [lista, setLista] = useState([])
    const [cargar, setcargar] = useState(0)

    validarParams()

    function validarParams(){
        if(params.cargarNCompra!=cargar){
            setcargar(params.cargarNCompra)
            const array =[]
            setLista(array)
        }
    }

    useEffect(() => {
        if(lista.length==0 && Object.keys(params.datos).length >0){
          fetchProductos()
        }
    },[cargar])

    function fetchProductos(){
        const urlDatos = glob.URL_SERV+"get_compras.php?modo=getNCompra&cedula="+params.datos.cliente+'&n_compra='+params.datos.compra_n
        fetch(urlDatos).then((response) => {
          return response.json()
        })
        .then((json) => {
           setLista(json)
           setTimeout(() => {
            setTotal()
           }, 200);    
        })
    }
    
    function setTotal(){
        let total=0
        if(lista.length>0){
            lista.map((item)=>{
                let subtotal= parseInt(item.domicilio*item.cambio)
                total=total+subtotal
            })
        }
        return total
    }

  return (
    <div className="modal fade" id='dialogoCompraN' tabIndex="-1" >
        <div className="modal-dialog modal-lg"> 
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Lista productos compra N°: {params.datos.compra_n} de {params.datos.periodicidad}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className='container table-responsive'>
                        <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Producto</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Precio Unidad</th>
                                <th scope="col">Subtotal</th>
                            </tr>
                        </thead>
                            <tbody>
                            {lista.map((item, index)=>{
                                const subt=parseInt(item.domicilio*item.cambio)
                                return(
                                    <tr scope="row" key={index}>
                                        <th>{item.n_cuotas}</th>
                                        <td>{item.domicilio}</td>
                                        <td>{glob.formatNumber(item.cambio)}</td>
                                        <td>{glob.formatNumber(subt)}</td>
                                    </tr>
                                )
                            })} 
                            <tr>
                                <th></th>
                                <th></th>
                               <th>Total compra:</th> 
                               <th id='thTotal'>{glob.formatNumber(setTotal())}</th> 
                            </tr>
                            </tbody>
                        </table>
                    </div>  
                </div>
                <div style={{display: lista.length==0 ? 'inline' : 'none'}}>
                   <Cargando /> 
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div> 
            </div>
        </div>
    </div> 
  )
}

export default DialogoCompraN