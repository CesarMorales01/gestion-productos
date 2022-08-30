import React from 'react'
import Select from 'react-select'
import { useState, useEffect } from 'react';

const SelectProductos = (params) => {
   const [options, setOptions]= useState([])

   useEffect(() => {
    cargarDatos()
  })

  function cargarDatos(){
    if(options.length==0 && params.productos.length>0){
        let opts=[]
        for (let i=0; i<params.productos.length; i++){
            let item= new OptionsAuto(params.productos[i].codigo, params.productos[i].nombre)
            opts.push(item)
        }
        setOptions(opts)
    } 
  }

  function getChange(e){
     document.getElementById('inputValue').value=e.codigo
     document.getElementById('inputValue').click()
  }

  return (
    <div >
        <input type='hidden' id='inputValue' onClick={params.cambioProducto} />
        <Select value={params.valorSelect} onChange={getChange} options={options} />
   </div> 
  )
}

export default SelectProductos

class OptionsAuto {
    constructor(codigo, label) {
        this.codigo = codigo;
        this.label = label;
    }
}