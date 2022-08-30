import React from 'react'
import { useState, useEffect } from 'react';
import DialogoEliminar from '../IUGeneral/DialogoEliminar'
import GlobalFunctions from '../../services/GlobalFunctions'

const ShoppingCart = (params) => {
    const glob= new GlobalFunctions()
    const [productos, setProductos] = useState([])
    const [idEliminar, setIdEliminar] = useState('')

    useEffect(() => {
       revisarDatos()
    })

    function revisarDatos(){
        if(params.productosCarrito.length!=productos.length){
            setProductos(params.productosCarrito)
        }
    }

    function goBorrar(){
        document.getElementById('btnDialogoEliminar').click()
        document.getElementById('inputGoNuevaCompra').click()
    }

    function abrirDialogoElimininar(cod){
        setIdEliminar(cod)
        document.getElementById('btnDialogoEliminar').click()
    }

  return (
    <div className='container border'>
    <div className="row" style={{color: 'green',}}>
      <div className="align-self-center">
        <h5 style={{textAlign: 'center'}} >Carrito de compras</h5>
      </div>
    </div>
    <div className="table-responsive">
    <table className="table">
        <thead>
            <tr>
                <th scope="col">Producto</th>
                <th scope="col">Valor</th>
                <th scope="col">Cant</th>
                <th scope="col">Subtotal</th>
                <th scope="col">Sumar</th>
                <th scope="col">Borrar</th>
            </tr>
        </thead>
        <tbody>
        {productos.map((item, index)=>{
                    return(
                        <tr key={index} > 
                            <td style={{fontSize:'0.8em'}}>{item.nombre}</td> 
                            <td>${glob.formatNumber(item.precio)}</td>
                            <td><span style={{color:'green', marginLeft:'0.5em'}}>{item.cantidad}</span></td>
                            <td>${glob.formatNumber(item.precio*item.cantidad)}</td>
                            <td>
                                <button onClick={()=>params.masCant(item.codigo)} className="btn btn-light btn-sm"><i  className="fas fa-plus fa-sm"></i></button>
                                <button onClick={()=>params.menosCant(item.codigo)} className="btn btn-light btn-sm"><i className="fas fa-minus fa-sm"></i></button>
                            </td>
                            <td>
                                <button onClick={() => abrirDialogoElimininar(item.codigo)} className='btn btn-danger btn-sm'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                        </svg>
                                </button>      
                            </td>
                        </tr>  
                    )
        })} 
        </tbody>
    </table>
    </div>  
      <br/>      
    {/* dialogo eliminar*/}
    <button type='button' style={{display: 'none'}} data-bs-toggle="modal"  data-bs-target="#dialogoEliminar" id='btnDialogoEliminar'></button>
    <input type='hidden' id='inputGoNuevaCompra' onClick={()=>params.borrarProducto(idEliminar)} ></input>
    <DialogoEliminar display={'inline'} accion={goBorrar} titulo={'Eliminar este producto'} textoConfirmar={'Confirmar'}/>
  </div>
  )
}

export default ShoppingCart