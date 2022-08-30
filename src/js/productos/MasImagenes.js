import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../../services/GlobalFunctions'

const MasImagenes = (params) => {
    const glob= new GlobalFunctions()
    const [imagenes, setImagenes] = useState([])
    const [id, setId] = useState('')
    const [mensajeImgs, setMensajeImgs] = useState('')

    checkId()

    function checkId(){
        if(id!=params.id){
            setId(params.id)
        }
    }

    useEffect(() => {
        if(imagenes.length==0 && id!=''){
            fetchImagenes()
        }
    },[imagenes, id])

    function fetchImagenes(){
        const url = glob.URL_SERV+'IngresarImagenesProductos.php?modo=getImagenes&id='+params.id
        fetch(url)
        .then((response) => {
          return response.json()
        }).then((json) => { 
          setImagenes(json)
        })
    }  

   function loadingOffImgs(){
      document.getElementById('btnIngresarImg').style.display='inline'
      document.getElementById('btnLoadingImg').style.display='none'
   }
   
   function loadingOnImgs(){
    document.getElementById('btnIngresarImg').style.display='none'
    document.getElementById('btnLoadingImg').style.display='inline'
   }

   function fetchIngresarImagenImgs(){
    if(document.getElementById("fileImgs").files.length>0){
        loadingOnImgs()
        const url = glob.URL_SERV+'IngresarImagenesProductos.php?modo=ingresarImagen&producto='+params.id
        let fd = new FormData();
        fd.append("foto", document.getElementById("fileImgs").files[0])
        fetch(url, {
            method: 'POST',
            body: fd
            }).then((response) => {
            return response.json()
            })
          .then((json) => {
            if(json.nombre=='Foto en directorio' && json.referencia=='Imagen insertada en base de datos'){
                setMensajeImgs('Imagen guardada.')
                reiniciarImagenes() 
                document.getElementById('ingresarImg').src=process.env.REACT_APP_URL_IMAGES+'Imagenes_config/noPreview.jpg'   
                loadingOffImgs()  
            }else{
                setMensajeImgs('Problemas al guardar la imagen!')
            }
          })  
    }else{
        alert('Debes adjuntar una imagen!')
    }
}

function reiniciarImagenes(){
    const array=[]
    setImagenes(array) 
    document.getElementById('inputReiniciarProductosImgs').click()
}

function fetchValidarNombreImagenImgs(img){
    document.getElementById('spanvalidandoNombreImagenImgs').style.display=''
    const url = glob.URL_SERV+'IngresarImagenesProductos.php?modo=validarNombreImagen&nombreImagen='+img
    fetch(url)
    .then((response) => {
    return response.json()
    }).then((json) => { 
        document.getElementById('spanvalidandoNombreImagenImgs').style.display='none'  
        if(json=='Existe'){
            setMensajeImgs('Ya existe una imagen con este nombre. Ponle otro!')
        }else{
            setMensajeImgs('')
        }
    })  
}

function mostrarImagenImgs(event) {
    var file = event.target.files[0];
    fetchValidarNombreImagenImgs(file.name);
    var reader = new FileReader();
    reader.onload = function(event) {
        var img = document.getElementById('ingresarImg');
        img.src= event.target.result;
    }
    reader.readAsDataURL(file);
}

function fetchBorrarImagen(img){
    loadingOnImgs()
    const url = glob.URL_SERV+'IngresarImagenesProductos.php?modo=borrarImagen'
    const objeto ={
        nombre: img
    }
    const array=[]
    array.push(objeto)
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(array),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    .then((response) => {
      return response.json()
    }).then((json) => { 
       if(json.baseDatos=='Imagen borrada de base de datos' && json.imagenes.length>0){
         setMensajeImgs('Imagen eliminada.')
         document.getElementById('botonDialogoEliminarImg').click()
         reiniciarImagenes()
         loadingOffImgs()
       }else{
        alert('Error al eliminar imagen!')
       }
    })
}

  return ( 
    <div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg"> 
            <div className="modal-content">
            <div className="modal-header">
                <input type='hidden' id='inputReiniciarProductosImgs' onClick={params.reiniciarProductos}/>
                <h5 className="modal-title" id="exampleModalLabel">Imagenes de {params.nombre}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div> 
                <div className='container' style={{margin: '0.2em'}}>
                    <div style={{padding: '0.2em'}} className='row border'>
                        <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                            <input data-toggle="tooltip" title="Ingresa imagenes con fondo blanco, aprox 500x500 mp." type="file"  id="fileImgs"  onChange={mostrarImagenImgs}/>
                            <span style={{color: 'red'}}>{mensajeImgs}</span>
                            <br/>
                            <span id='spanvalidandoNombreImagenImgs' style={{display: 'none'}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                            <img id="ingresarImg" width="140px" height="150px" src={process.env.REACT_APP_URL_IMAGES+'Imagenes_config/noPreview.jpg'}/>
                        </div>
                        <br/>
                        <div style={{marginTop: '0.4em'}} className="col text-center">
                            <button onClick={fetchIngresarImagenImgs} id="btnIngresarImg" style={{display:'none'}} className="btn btn-success">Ingresar imagen</button>
                            <button id='btnLoadingImg' style={{display:'inline', backgroundColor:'red'}} className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                            </button>
                        </div>

                    </div>
                    <div style={{marginTop: '0.4em'}} className="container"> 
                        <div className="row border">
                            <h6 style={{textAlign: 'center', marginTop: '0.4em'}}>Imagenes almacenadas:</h6>
                            {imagenes.map((item, index)=>{
                                return(
                                <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-6">
                                    {/* dialogo eliminar*/}
                                    <button className='rounded-circle' type="button" id='botonDialogoEliminarImg' data-bs-toggle="modal"  data-bs-target="#dialogoEliminarImgs"  style={{display: imagenes.length>1 ? 'inline' : 'none', backgroundColor: 'red'}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                        </svg>
                                    </button>

                                    <img onLoad={loadingOffImgs} className="img-fluid" src={process.env.REACT_APP_URL_IMAGES+'Imagenes_productos/'+item.nombre}/> 

                                    <div className="modal fade" id="dialogoEliminarImgs" tabIndex="-1" aria-labelledby="exampleModalLabel"   aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Eliminar imagen {item.nombre}?</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Cancelar</button>
                                                    <button type="button" onClick={()=>fetchBorrarImagen(item.nombre)} className="btn btn-danger">Confirmar</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>                      
                                )
                            })} 
                        </div> 
                    </div>
                    <br/>
                </div>
            </div>
        </div>
    </div> 
  )
}

export default MasImagenes