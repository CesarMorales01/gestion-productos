import React from 'react'
import Cargando from '../IUGeneral/Cargando'
import GlobalFunctions from '../../services/GlobalFunctions'
import { useState, useEffect } from 'react';
import NuevaPromocion from './NuevaPromocion';

const Promociones = (params) => {
    const glob= new GlobalFunctions()
    const [promos, setPromos] = useState([])
    const [editPromo, setEditPromo] = useState({})
    const [validarDialogo, setValidarDialogo] = useState(0)
    const [cargar, setCargar] = useState(true)

    useEffect(() => {
        if(cargar){
          fetchPromos()
        }
    }, [promos])

    function fetchPromos(){
        const url = glob.URL_SERV+"gestionPromos.php?code=getPromos"
        fetch(url).then((response) => {
          return response.json()
        })
        .then((json) => {
          setCargar(false)
          if(json.length==0){
            setListaCero()
          }else{
            setPromos(json)
          }
        })     
    }

    function setListaCero(){ 
        const obj={
          nombre: 'No hay promociones!!!',
          ref: '',
          imagen: ''
        }
      const array = []
      array.push(obj)
      setPromos(array)
    }
    
    function abrirDialogo(item){
        setEditPromo(item)
        setValidarDialogo(validarDialogo+1)
        document.getElementById('btnAbrirNuevaPromo').click()
    }

    function setNuevaPromo(){
      setValidarDialogo(validarDialogo+1)
      setEditPromo({
         nombre: 'new'
      })
      document.getElementById('btnAbrirNuevaPromo').click()
    }

    function reiniciarPromos(){
       const array=[]
       setPromos(array)
       document.getElementById('btnAbrirNuevaPromo').click()
    }

    if(promos.length>0){
        return (
          <div className='container table-responsive'>
             <div style={{marginTop: '0.2em'}} align="center" className="row justify-content-center">
                <div className="col-lg-6 col-md-6 col-sm-12 col-12" >
                  <button onClick={setNuevaPromo}  type="button" style={{backgroundColor: '#f0e094', color: 'black'}} className='btn btn-primary btn-sm'>
                     Nueva promocion
                  </button>
                </div>
                <div style={{marginTop: '0.2em'}} className="col-lg-6 col-md-6 col-sm-12 col-12" >
                  <span id='loadingCategoria' style={{display: 'none'}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>          
              </div>  
            </div>
            <table className="table table-striped">
              <thead>
                      <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Imagen</th>
                        <th scope="col">Ref Producto</th>
                      </tr>
              </thead>
              <tbody>
              {promos.map((item, index)=>{
                return(
                  <tr key={index}>
                    <th scope="row">
                      {item.codigo}
                      <br/>
                      <span onClick={()=>abrirDialogo(item)} className='border border-dark rounded cursorPointer' style={{padding: '0.2em', backgroundColor: '#f0e094'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                      </svg>
                      </span>
                    </th>
                    <td>{item.nombre}</td>
                    <td>{item.imagen}
                    <br/>
                    <img style={{width: '6em', heigth: '6em'}} src={process.env.REACT_APP_URL_IMAGES+item.imagen} />
                    </td>
                    <td>{item.producto}</td>
                  </tr>
                )
              })}
              </tbody>
            </table>
            <button id='btnAbrirNuevaPromo' style={{display: 'none'}} data-toggle="modal" data-target="#dialogoNuevaPromocion"></button>
            <NuevaPromocion reiniciarPromos={reiniciarPromos} validarDialogo={validarDialogo} promo={editPromo} productos={params.productos}/>  
        </div>
        )
      }else{
        return(
          <Cargando />
        )
      }
}

export default Promociones