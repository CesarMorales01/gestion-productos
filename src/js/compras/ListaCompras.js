import React from 'react'
import Cargando from '../IUGeneral/Cargando'
import GlobalFunctions from '../../services/GlobalFunctions'
import { useState, useEffect } from 'react';
import TablaListaCompras from './TablaListaCompras';


const ListaCompras = (params) => {
    const glob= new GlobalFunctions()
    const [lista, setLista] = useState([])
    const [filterLista, setFilterLista] = useState([])
    const [message, setMessage] = useState('')
    const [cargar, setCargar] = useState(true)

  useEffect(() => {
      if(cargar){
        fetchLista()
      }
  }, [lista])

  function fetchLista(){
      const url = glob.URL_SERV+"get_compras.php?modo=getLista"
      fetch(url).then((response) => {
        return response.json()
      })
      .then((json) => {
        setCargar(false)
        if(json.length==0){
          setListaCero()
        }else{
          setLista(json)
          setFilterLista(json)
        } 
      })     
  }

  function setListaCero(){
    const array = []
          const obj={
            fecha: '',
            periodicidad: 'No hay compras registradas',
            compra_n: '',
            domicilio: '',
            medio_de_pago: '',
            comentarios: ''
          }
          array.push(obj)
          setFilterLista(array)
  }

  function cambioNombre(e){
    const buscar=e.target.value.toLowerCase()
    let newArray=[]
    for(let i=0;i<lista.length; i++){
      if(lista[i].periodicidad.toLowerCase().includes(buscar)){
        newArray.push(lista[i])
      }
    }
    setFilterLista(newArray)
  }

  function borrarInput(){
    document.getElementById('inputBuscar').value=''
    document.getElementById('inputBuscar').click()
  }

 function fetchCompras(e){
    setCargar(true)
    const array=[]
    setLista(array)
    setFilterLista(array)
    setMessage(e)
    setTimeout(() => {
       const buscado=document.getElementById('inputBuscar').value
       document.getElementById('inputBuscar').value= ''
       document.getElementById('inputBuscar').click()
       document.getElementById('inputBuscar').value=buscado
       document.getElementById('inputBuscar').click()
    }, 200);
 }

  return (
    <div className='container table-responsive'>
                 <div style={{marginTop: '0.2em'}} align="center" className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-12 col-12" >
                      <a onClick={params.nuevaCompra} style={{backgroundColor: '#f0e094', color: 'black'}} className='btn btn-primary btn-sm'>Registrar compra</a> 
                    </div>
                    <div style={{marginTop: '0.2em'}} className="col-lg-6 col-md-6 col-sm-12 col-12" >
                      <div className="row justify-content-center">
                          <div className="col-12" >
                              <input type="text" id='inputBuscar' onClick={cambioNombre} onChange={cambioNombre} placeholder="Buscar compra..."/>
                              <span onClick={borrarInput} className='border border-dark rounded cursorPointer' style={{padding: '0.2em', backgroundColor: 'red'}}  id="btn_buscar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                                </svg>
                              </span>
                          </div>
                      </div> 
                  </div>  
                </div>  
             <div style={{marginTop: '0.2em'}} align="center" className="row justify-content-center">
                <span style={{color: 'red'}}>{message}</span>             
            </div>
            <TablaListaCompras fetchCompras={fetchCompras} lista={filterLista}/>
            <div style={{display: filterLista.length===0 ? 'inline' : 'none'}}>
              <Cargando />
            </div>
        </div>
  )

}

export default ListaCompras