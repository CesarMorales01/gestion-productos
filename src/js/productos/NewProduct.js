import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../../services/GlobalFunctions'
import DialogoEliminar from '../IUGeneral/DialogoEliminar';
import MasImagenes from './MasImagenes';

const NewProduct = (params) => {
    const glob= new GlobalFunctions()
    const [producto, setProducto] = useState({
        id: '',
        referencia: '',
        categoria: '',
        nombre: '',
        descripcion: '',
        valor: '',
        imagen: '' 
    })
    const [message, setMessage] = useState('')
    const [displayBtnBorrar, setDisplayBtnBorrar] = useState('none')

    useEffect(() => {
        if(producto.imagen==''){
            if(params.producto.nombre=='new'){
                setProducto({
                    id: '',
                    referencia: '',
                    categoria: '',
                    nombre: '',
                    descripcion: '',
                    valor: '',
                    imagen: 'Imagenes_config/noPreview.jpg' 
                })
            }else{
                setProducto({
                    id: params.producto.codigo,
                    referencia: params.producto.referencia,
                    categoria: params.producto.categoria,
                    nombre: params.producto.nombre,
                    descripcion: params.producto.descripcion,
                    valor: params.producto.precio,
                    imagen: params.producto.listaImagenes[0].nombre 
                })
                setDisplayBtnBorrar('inline')
            }
        }
    })

    function cambioCate(cate){
        setProducto((valores) => ({
            ...valores,
            categoria: cate.target.value,
        }))
    }

    function cambioNombre(e) {
        setProducto((valores) => ({
          ...valores,
          nombre: e.target.value,
        }))
        if(producto.categoria==''){
           document.getElementById('selectCate').click()
        }
    }

    function cambioRef(e){
        setProducto((valores) => ({
            ...valores,
            referencia: e.target.value,
          }))
    }

    function cambioDescripcion(e){
        setProducto((valores) => ({
            ...valores,
            descripcion: e.target.value,
          }))
    }

    function cambioPrecio(e){
        setProducto((valores) => ({
            ...valores,
            valor: e.target.value,
        }))
    }

    function loadingOn(){
        document.getElementById('btnLoading').style.display='inline'
        document.getElementById('btnIngresar').style.display='none'
    }

    function loadingOff(){
        document.getElementById('btnLoading').style.display='none'
        document.getElementById('btnIngresar').style.display='inline'
        document.getElementById('inputReiniciarProductos').click()
    }

    function fetchIngresarProducto(){
        loadingOn()
        const url = glob.URL_SERV+'IngresarImagenesProductos.php?modo=ingresarProducto'
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(producto),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          return response.json()
        }).then((json) => { 
            if(json=='no se encontro el producto' || json=='Problemas al insertar producto'){
              setMessage('Problemas al insertar producto')
            }else{
              setMessage('Producto guardado.')
              fetchIngresarImagen(json)
            }
        })
    }

    function fetchEditarProducto(){
        loadingOn()
        const url = glob.URL_SERV+'IngresarImagenesProductos.php?modo=editarProducto'
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(producto),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          return response.json()
        }).then((json) => { 
          loadingOff()  
          if(json=='Editado'){
            setMessage('Producto editado.')
          }else{
            setMessage('Problemas al editar producto')
          }
        })
    }

    function fetchIngresarImagen(id){
        const url = glob.URL_SERV+'IngresarImagenesProductos.php?modo=ingresarImagen&producto='+id
        let fd = new FormData();
        fd.append("foto", document.getElementById("fileImagen").files[0])
            fetch(url, {
                method: 'POST',
                body: fd
            }).then((response) => {
                return response.json()
              })
              .then((json) => {
                if(json.nombre=='Foto en directorio' && json.referencia=='Imagen insertada en base de datos'){
                    setMessage('Imagen guardada.')
                    setProducto((valores) => ({
                        ...valores,
                        id: id,
                        imagen: document.getElementById("fileImagen").files[0].name,
                      }))
                    loadingOff()  
                }else{
                    setMessage('Problemas al guardar la imagen!')
                }
              })  
    }

    function validarCampos(){
        let validado=false
        if(producto.nombre!='' && producto.valor!=''){
            validado=true
            setMessage('')
        }else{
            setMessage('Faltan datos importantes!')
        }
        return validado
    }

    function validarContenidoFile(){
        let respuesta=false
        if(document.getElementById("fileImagen").files.length>0){
            respuesta=true
        }else{
            setMessage('Debes ingresar una imagen!')
        }
       return respuesta 
    }

   function validarFuncion(){
        if(validarCampos()){
            if(producto.id==''){
                if(validarContenidoFile()){
                    fetchIngresarProducto()
                }
             }else{
                fetchEditarProducto()
             }
        } 
   }

   function fetchValidarNombreImagen(img){
        document.getElementById('spanvalidandoNombreImagen').style.display=''
        const url = glob.URL_SERV+'IngresarImagenesProductos.php?modo=validarNombreImagen&nombreImagen='+img
        fetch(url)
        .then((response) => {
        return response.json()
        }).then((json) => { 
            document.getElementById('spanvalidandoNombreImagen').style.display='none'  
            if(json=='Existe'){
                setMessage('Ya existe una imagen con este nombre. Ponle otro!')
            }else{
                setMessage('')
            }
        })  
    }

    function loadingOnBorrar(){
        document.getElementById('btnLoadingBorrar').style.display='inline'
        document.getElementById('btnBorrar').style.display='none'
    }

   function fetchBorrar(){
      document.getElementById('btnDialogoEliminar').click()  
      loadingOnBorrar()
      const url = glob.URL_SERV+'IngresarImagenesProductos.php?modo=borrarProducto&id='+producto.id
      fetch(url,{
        method: 'POST',
        body: JSON.stringify(params.producto.listaImagenes),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => {
        return response.json()
      })
      .then((json) => {
          if(json.baseDatos.nombre=='Producto borrado de base de datos' && json.baseDatos.referencia=='Imagenes borradas de base de datos' && json.imagenes.length>0){
             setMessage('Producto eliminado!')
             setTimeout(() => {
                document.getElementById('inputRegresarProductos').click()
             }, 200);   
          }else{
            setMessage('Problemas al eliminar el producto!')
          }
      })       
   }

   function mostrarImagen(event) {
        var file = event.target.files[0];
        fetchValidarNombreImagen(file.name);
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = document.getElementById('img');
            img.src= event.target.result;

        }
        reader.readAsDataURL(file);
  }

  function dialogoBorrar(){
    document.getElementById('btnDialogoEliminar').click()
  }

  function spinOff(){
    document.getElementById('spanvalidandoNombreImagen').style.display='none'
  }

  function setPrecio(e){
    let uti=parseInt(e.target.value)*0.2;
    let precio= uti+parseInt(e.target.value)
    if(precio>0){
        setProducto((valores) => ({
            ...valores,
            valor: precio
        }))
    }
  }

  function reiniciarProductos(){
    document.getElementById('inputReiniciarProductos').click()
  }

  return (
    <div className="container justify-content-justify">
            <input type='hidden' id='inputReiniciarProductos' onClick={params.reiniciarProductos}/>
            <input type='hidden' id='inputRegresarProductos' onClick={params.regresarProductos}/>
            <h3 id="titulo" className="text-center">Ingresar producto</h3>
            <br/> 
            <div className="row justify-content-around">
                <div className="col-lg-6 col-md-6 col-sm-12 col-12"> 
                     Id (default)       
                    <input className='form-control' type="text" readOnly value={producto.id=='' ? '': producto.id}/> 
                    <br/>        
                    Referencia       
                    <input className='form-control' type="text" onChange={cambioRef} placeholder="Referencia" id="referencia" value={producto.referencia=='' ? '': producto.referencia}/> 
                    <br/>
                    Categoria:
                    <select onChange={cambioCate} onClick={cambioCate} id='selectCate' className="form-select" value={producto.categoria}>
                    {params.categorias.map((item, index)=>{
                        return(
                            <option key={index} value={item.nombre}>{item.nombre}</option>
                        )
                    })}
                    </select> 
                    <br/>
                    <textarea className='form-control' required onChange={cambioNombre} placeholder="Nombre" value={producto.nombre=='' ? '': producto.nombre}/>  
                    <br/>
                    <textarea className='form-control' rows="2" onChange={cambioDescripcion} placeholder="Descripcion" value={producto.descripcion=='' ? '': producto.descripcion}></textarea> 
                    <br/>
                    <input type="number" onChange={setPrecio} placeholder="Costo producto"/> 
                    <br/><br/>
                    <input className='form-control' onChange={cambioPrecio} type='number' required placeholder="Precio" defaultValue={producto.valor=='' ? '': producto.valor}/> 
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-12" >
                    <input data-toggle="tooltip" id='fileImagen' title="Ingresa imagenes con fondo blanco, aprox 500x500 mp." type="file" disabled={producto.id=='' ? false : true} onChange={mostrarImagen}/>
                    <br/>
                    <img onLoad={spinOff} className='border' id="img" width="140px" height="150px" src={producto.id=='' ? process.env.REACT_APP_URL_IMAGES+'Imagenes_config/noPreview.jpg' : process.env.REACT_APP_URL_IMAGES+'Imagenes_productos/'+producto.imagen}/>
                    <span id='spanvalidandoNombreImagen' style={{display: ''}} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <br/>
                    {producto.id==''?'':producto.imagen}
                    <br/><br/>
                    <span style={{color: 'red'}}>{message}</span> 
                    <br/><br/>
                    <div className='row'>
                        <div className='col-md-6 col-6'>
                            <button id="btnIngresar" onClick={validarFuncion} className="btn btn-success" type="button">{producto.id=='' ? 'Ingresar' : 'Editar'}</button>
                            <button id='btnLoading' style={{display:'none', backgroundColor:'green'}} className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </button>
                        </div>
                        <div className='col-md-6 col-6'>
                        <button id="btnBorrar" style={{display: displayBtnBorrar}} onClick={dialogoBorrar} className="btn btn-danger" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                        <button id='btnLoadingBorrar' style={{display:'none', backgroundColor:'red'}} className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                        </button>
                        </div>

                    </div>
                    
                    <br/><br/>
                    <button disabled= {producto.id=='' ? true : false} type="button" className="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-images" viewBox="0 0 16 16">
                            <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                            <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"/>
                        </svg>
                        <span style={{marginLeft: '0.2em'}}>Subir más imagenes</span>
                    </button>
                    <MasImagenes reiniciarProductos={reiniciarProductos} id={producto.id} nombre={producto.nombre}/>
                    <br/><br/>
                    <button disabled={producto.id=='' ? true : false} className="btn btn-primary" >Preguntas sobre este producto</button>
                    
                    <br/><br/>
                </div>
            </div>
            {/* dialogo eliminar*/}
             <button  type="button" id='btnDialogoEliminar' data-bs-toggle="modal"  data-bs-target="#dialogoEliminar" style={{display:'none'}}></button>
             <DialogoEliminar display={'inline'} accion={fetchBorrar} titulo={'Eliminar este producto?'} textoConfirmar={'Confirmar'}/>
  </div>
  )
}

export default NewProduct