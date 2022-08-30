import React from 'react'
import { useState, useEffect } from 'react';
import Cargando from '../IUGeneral/Cargando';
import TablaProductos from './TablaProductos';

const Productos = (params) => {
  const [productos, setProductos] = useState([])
  const [filterProducts, setFilterProducts] = useState([])
  const [producto, setProducto] = useState({})

  
  useEffect(() => {
    if(params.productos.length!=productos.length){
      setProductos(params.productos)
      setFilterProducts(params.productos)
    }
  })

  useEffect(() => {
  }, [filterProducts, productos])

  function cambioNombre(e) {
    const buscar=e.target.value.toLowerCase()
    let newArray=[]
    for(let i=0;i<params.productos.length; i++){
      if(params.productos[i].nombre.toLowerCase().includes(buscar) || params.productos[i].descripcion.toLowerCase().includes(buscar)){
        newArray.push(params.productos[i])
      }
    }
    setFilterProducts(newArray)
  }

  function borrarInput(){
    document.getElementById('inputBuscar').value=''
    document.getElementById('inputBuscar').click()
  }

  function irEditar(item){
    setProducto(item)
    setTimeout(() => {
       document.getElementById('inputIrEditar').click()
    }, 100);
  }

  function goNewProduct(){
    setProducto({
      nombre: 'new'
    })
    setTimeout(() => {
       document.getElementById('inputIrEditar').click()
    }, 100);
  }

  if(productos.length>0){
    return (
      <div className='container'>
        <input type='hidden' id='inputIrEditar' onClick={()=>params.irEditar(producto)}/>
        <div style={{marginTop: '0.2em'}} align="center" className="row justify-content-center">
            <div className="col-lg-6 col-md-6 col-sm-12 col-12" >
              <a onClick={goNewProduct} style={{backgroundColor: '#f0e094', color: 'black'}} className='btn btn-primary btn-sm'>Nuevo producto</a> 
            </div>
            <div style={{marginTop: '0.2em'}} className="col-lg-6 col-md-6 col-sm-12 col-12" >
               <div className="row justify-content-center">
                  <div className="col-12" >
                      <input type="text" id='inputBuscar' onClick={cambioNombre} onChange={cambioNombre} placeholder="Buscar producto..."/>
                      <span onClick={borrarInput} className='border border-dark rounded cursorPointer' style={{padding: '0.2em', backgroundColor: 'red'}}  id="btn_buscar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                        </svg>
                      </span>
                  </div>
              </div> 
          </div>  
        </div>
        <h5 style={{marginTop: '0.2em'}} align="center">Lista de productos</h5> 
        <TablaProductos irEditar={irEditar} productos={filterProducts} />
      </div>
    )
  }else{
    return(
      <Cargando />
    )
  }
}

export default Productos