import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../../services/GlobalFunctions'
import DialogoEliminar from '../IUGeneral/DialogoEliminar';
import SelectProductos from '../compras/SelectProductos';

const NuevaPromocion = (params) => {
    const glob= new GlobalFunctions()
    const [mensaje, setMensaje] = useState('')
    const [valorSelect, setValorSelect] = useState('')
    const [validarDialogo, setValidarDialogo] = useState(0)
    const [promo, setPromo] = useState({
        nombre: '',
        imagen: '',
        codigo: '',
        codigoPromo: ''
    })

    useEffect(() => {
       validarParams()
    })

    function validarParams(){
        if(params.validarDialogo!=validarDialogo){
            setValidarDialogo(params.validarDialogo)
            if(params.promo.nombre=='new'){
                setPromo((valores) => ({
                    ...valores,
                    nombre: '',
                    imagen: '',
                    codigo: ''
                })) 
                document.getElementById('img').src=process.env.REACT_APP_URL_IMAGES+'Imagenes_config/noPreview.jpg'
            }else{
               setPromo((valores) => ({
                    ...valores,
                    nombre: params.promo.nombre,
                    imagen: params.promo.imagen,
                    codigo: params.promo.referencia,
                    codigoPromo: params.promo.codigo
                 }))
                 document.getElementById('img').src=process.env.REACT_APP_URL_IMAGES+params.promo.imagen
            }
            document.getElementById("fileImg").value=null
        }     
    }

    function mostrarImagen(event){
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = document.getElementById('img');
            img.src= event.target.result;

        }
        reader.readAsDataURL(file)
        setPromo((valores) => ({
            ...valores,
            imagen: 'Imagenes_productos/'+event.target.files[0].name
        }))
    }

    function loadingOn(){
        document.getElementById('btnLoading').style.display='inline'
        document.getElementById('btnIngresar').style.display='none'
    }

    function loadingOff(){
        document.getElementById('btnLoading').style.display='none'
        document.getElementById('btnIngresar').style.display='inline'
    }

    function fetchIngresarPromo(){
        if(promo.nombre!='' && promo.imagen!='' && promo.codigo!=''){
            loadingOn()
            setMensaje('')
            const url = glob.URL_SERV+'gestionPromos.php?code=ingresarPromo&nombre='+promo.nombre+'&imagen='+promo.imagen+'&codigo='+promo.codigo
            let fd = new FormData();
            fd.append("foto", document.getElementById("fileImg").files[0])
            fetch(url, {
                method: 'POST',
                body: fd
            }).then((response) => {
               return response.json()
            }).then((json) => { 
               loadingOff()
               if(json.baseDatos=='Promo creada'){
                   setMensaje('Promoción creada!') 
                   setTimeout(() => {
                      document.getElementById('inputReiniciarPromos').click()
                   }, 100);
               }else{
                alert('Ha ocurrido un error al ingresar la promoción!')
               }
            })
        }else{
            setMensaje('Faltan datos importantes!')
        } 
    }

    function cambioNombre(e){
        setPromo((valores) => ({
            ...valores,
            nombre: e.target.value,
          }))
    }

    function cambioProducto(e){
            let nombre=''
            let imagen=''
            let codigo=''
            for(let i=0; i<params.productos.length;i++){  
                if(params.productos[i].codigo==e.target.value){
                    codigo= params.productos[i].codigo
                    nombre=params.productos[i].nombre+': $ '+glob.formatNumber(params.productos[i].precio)
                    imagen='Imagenes_productos/'+params.productos[i].listaImagenes[0].nombre
                }
            }
            setPromo((valores) => ({
              ...valores,
              nombre: nombre,
              imagen: imagen,
              codigo: codigo
            }))
            document.getElementById("fileImg").value=null
            document.getElementById('img').src=process.env.REACT_APP_URL_IMAGES+imagen
    }

    function getFileSize(){
        if(document.getElementById('fileImg')!=null){
            return document.getElementById('fileImg').files.length
        }else{
            return 0
        }  
    }

    function fetchBorrar(){
        loadingOn()
        let img= promo.imagen.split('Imagenes_productos/')
        const url = glob.URL_SERV+'gestionPromos.php?code=borrarPromo&id='+promo.codigoPromo+'&img='+img[1]
            fetch(url).then((response) => {
               return response.json()
            }).then((json) => { 
               if(json.baseDatos=='Promo eliminada'){
                   setMensaje('Promoción eliminada!') 
                   setTimeout(() => {
                      document.getElementById('inputReiniciarPromos').click()
                      document.getElementById('btnDialogoEliminar').click()
                   }, 100);
               }else{
                alert('Ha ocurrido un error al eliminar la promoción!')
               }
            })
    }

  return (
    <div className="modal fade bd-example-modal-lg" id='dialogoNuevaPromocion' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <input type='hidden' onClick={params.reiniciarPromos} id='inputReiniciarPromos'/>
        <div className="modal-dialog modal-lg"> 
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">{params.promo.nombre=='new' ? 'Crear promoción' : 'Editar promoción'}</h5>
                <button className='rounded' type="button" id='btnDialogoEliminar' data-bs-toggle="modal"  data-bs-target="#dialogoEliminar" style={{display: params.promo.nombre=='new' ? 'none' : 'inline', backgroundColor: 'red'}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                </button>
                {/* dialogo eliminar*/}
             <DialogoEliminar display={'inline'} accion={fetchBorrar} titulo={'Eliminar esta promoción?'} textoConfirmar={'Confirmar'}/>
            </div> 
                <div className='container border' style={{margin: '0.2em'}}>
                <div style={{marginTop: '0.6em'}} className="row justify-content-center">
                     <div className="col-12" >
                        <SelectProductos valorSelect={valorSelect} cambioProducto={cambioProducto} productos={params.productos} />
                    </div>
                </div> 
                <br/>
                <textarea className='form-control col-12'  onChange={cambioNombre} placeholder="Descripción" value={promo.nombre=='' ? '': promo.nombre}/>        
                    <br/> 
                    <div style={{padding: '0.2em'}} className='row'> 
                        <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                            <input data-toggle="tooltip" title="Ingresa imagenes con fondo blanco, aprox 500x500 mp." type="file"  id="fileImg"  onChange={mostrarImagen}/>
                            <span style={{color: 'red'}}>{mensaje}</span>
                            <br/>
                            <span style={{color: 'black'}}>{getFileSize>0 ? '' : promo.imagen}</span>
                        </div>
                        <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                            <img id="img" width="140px" height="150px" src={process.env.REACT_APP_URL_IMAGES+'Imagenes_config/noPreview.jpg'}/>
                        </div>
                        <br/>
                        <div style={{marginTop: '0.4em'}} className="row col text-center">
                            <div className='col 6'>
                                <button data-dismiss="modal" className="btn btn-danger">Cancelar</button>  
                            </div>
                            <div className='col 6'>
                                <button onClick={fetchIngresarPromo} id="btnIngresar" style={{display:'inline'}} className="btn btn-success">{params.promo.nombre=='new' ? 'Crear promoción' : 'Editar promoción'}</button>
                                <button id='btnLoading' style={{display:'none', backgroundColor:'red'}} className="btn btn-primary" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading...
                                </button>
                            </div>    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> 
  )
}

export default NuevaPromocion