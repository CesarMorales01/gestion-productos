import React from 'react'
import Cargando from '../IUGeneral/Cargando'
import GlobalFunctions from '../../services/GlobalFunctions'
import { useState, useEffect } from 'react';
import TablaClientes from './TablaClientes';
import TablaClientesIncompletos from './TablaClientesIncompletos';

const Clientes = (params) => {
    const glob= new GlobalFunctions()
    const [registroCompleto, setRegistroCompleto] = useState([])
    const [registroInCompleto, setRegistroInCompleto] = useState([])
    const [cargarCompleto, setCargarCompleto] = useState(true)
    const [cargarInCompleto, setCargarInCompleto] = useState(true)
    const [filterClients, setFilterClients] = useState([])
    const [filterClientsIncompletos, setFilterClientsIncompletos] = useState([])

  useEffect(() => {
      if(cargarCompleto){
        fetchClientesRegistroCompleto()
      }
  }, [registroCompleto])

  useEffect(() => {
    if(cargarInCompleto){
      fetchClientesRegistroInCompleto()
    }
}, [registroInCompleto])

  function fetchClientesRegistroCompleto(){
      const url = glob.URL_SERV+"get_clientes.php?modo=getAll"
      fetch(url).then((response) => {
        return response.json()
      })
      .then((json) => {
          setCargarCompleto(false)
          setRegistroCompleto(json)
          setFilterClients(json)
      })     
  }

  function fetchClientesRegistroInCompleto(){
    const url = glob.URL_SERV+"get_clientes.php?modo=getAllRegistroIncompleto"
    fetch(url).then((response) => {
      return response.json()
    })
    .then((json) => {  
        setCargarInCompleto(false)
        setRegistroInCompleto(json)
        setFilterClientsIncompletos(json)
    })     
  }

  function cambioNombre(event){
      const buscar=event.target.value.toLowerCase()
      let newArray=[]
        for(let i=0;i<registroCompleto.length; i++){
          if(registroCompleto[i].nombre.toLowerCase().includes(buscar) || registroCompleto[i].direccion.toLowerCase().includes(buscar)){
            newArray.push(registroCompleto[i])
          }
        setFilterClients(newArray)
      }
  }

  function cambioNombreIncompletos(event){
    const buscar=event.target.value.toLowerCase()
    let newArray=[]
      for(let i=0;i<registroInCompleto.length; i++){
        if(registroInCompleto[i].usuario.toLowerCase().includes(buscar) || registroInCompleto[i].correo.toLowerCase().includes(buscar)){
          newArray.push(registroInCompleto[i])
        }
      setFilterClientsIncompletos(newArray)
    }
}

  function borrarInput(){
    document.getElementById('inputBuscar').value=''
    document.getElementById('inputBuscar').click()
  }

  function borrarInputIncompletos(){
    document.getElementById('inputBuscarIncompletos').value=''
    document.getElementById('inputBuscarIncompletos').click()
  }

  return (
    <div className='container'>
    <input type='hidden' id='inputIrEditar' />
    <div id='sectionCompletos'  style={{marginTop: '0.2em'}} align="center" className="row justify-content-center">
        <div className="col-lg-6 col-md-6 col-sm-12 col-12" >
          <a onClick={()=>params.newClient('', '')} style={{backgroundColor: '#f0e094', color: 'black'}} className='btn btn-primary btn-sm'>Nuevo cliente</a> 
        </div>
        <div style={{marginTop: '0.2em'}} className="col-lg-6 col-md-6 col-sm-12 col-12" >
           <div className="row justify-content-center">
              <div className="col-12" >
                  <input type="text" id='inputBuscar' onClick={cambioNombre} onChange={cambioNombre} placeholder="Buscar cliente..."/>
                  <span onClick={borrarInput} className='border border-dark rounded cursorPointer' style={{padding: '0.2em', backgroundColor: 'red'}}  id="btn_buscar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                    </svg>
                  </span>
              </div>
          </div> 
      </div>  
    </div>
    <h5 style={{marginTop: '0.2em'}} align="center">Lista clientes</h5> 
    <div align="center" className="row justify-content-center">
      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
        <a href='#sectionCompletos' className='btn btn-success btn-sm'><span>&#8593;</span> Completos</a> 
      </div>
      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
        <a href='#sectionIncompletos' className='btn btn-secondary btn-sm'><span>&#8595;</span> Incompletos</a>
      </div>
    </div>
    <TablaClientes irEditar={params.irEditar} clientes={filterClients} />
    <div style={{display: filterClients.length==0 ? 'inline' : 'none'}}><Cargando/></div>
    <div id='sectionIncompletos' style={{marginTop: '0.2em'}} align="center" className="row justify-content-center">
    <h5 style={{marginTop: '0.2em'}} align="center">Clientes con registro incompleto</h5> 
        <div style={{marginTop: '0.2em'}} className="col-lg-6 col-md-6 col-sm-12 col-12" >
           <div className="row justify-content-center">
              <div className="col-12" >
                  <input type="text" id='inputBuscarIncompletos' onClick={cambioNombreIncompletos} onChange={cambioNombreIncompletos} placeholder="Buscar cliente..."/>
                  <span onClick={borrarInputIncompletos} className='border border-dark rounded cursorPointer' style={{padding: '0.2em', backgroundColor: 'red'}}  id="btn_buscarIncompletos">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                    </svg>
                  </span>
              </div>
          </div> 
      </div>  
    </div>
    <br/>
    <div align="center" className="row justify-content-center">
      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
        <a href='#sectionCompletos' className='btn btn-success btn-sm'><span>&#8593;</span> Completos</a> 
      </div>
      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
        <a href='#sectionIncompletos' className='btn btn-secondary btn-sm'><span>&#8595;</span> Incompletos</a>
      </div>
    </div>
    <TablaClientesIncompletos irEditar={params.irEditar} clientes={filterClientsIncompletos}/>
    <div style={{display: filterClients.length==0 ? 'inline' : 'none'}}><Cargando/></div>
  </div>
  )
}

export default Clientes