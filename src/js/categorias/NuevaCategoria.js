import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../../services/GlobalFunctions'

const NuevaCategoria = (params) => {
    const glob= new GlobalFunctions()
    const [categoria, setCategoria] = useState({
        nombre: '',
        imagen: ''
    })

    function cambioNombre(cate){
        setCategoria((valores) => ({
            ...valores,
            nombre: cate.target.value,
        }))
    }

    function mostrarImagen(event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = document.getElementById('ingresarImg');
            img.src= event.target.result;
        }
        reader.readAsDataURL(file);
        setCategoria((valores) => ({
            ...valores,
            imagen: event.target.files[0].name
        }))
    }

    function loadingOn(){
        document.getElementById('btnIngresar').style.display='none'
        document.getElementById('btnLoading').style.display='inline'
    }

    function loadingOff(){
        document.getElementById('btnIngresar').style.display='inline'
        document.getElementById('btnLoading').style.display='none'
    }

    function fetchNuevaCategoria(){
        if(categoria.nombre!='' && categoria.imagen!=''){
            loadingOn()
            const url = glob.URL_SERV+'get_categorias.php?code=ingresarCategoria&nombre='+categoria.nombre+'&imagen='+categoria.imagen
            let fd = new FormData();
            fd.append("foto", document.getElementById("fileImg").files[0])
            fetch(url, {
                method: 'POST',
                body: fd
            })
            .then((response) => {
            return response.json()
            }).then((json) => { 
              loadingOff()
              if(json.baseDatos=='Categoria creada' && json.directorio=='Imagen en directorio'){
                document.getElementById('inputReiniciarCategorias').click()
              }else{
                alert('Ha ocurrido un error al crear la categoria!')
              }  
            })
        }else{
            alert('Faltan datos importantes!')
        }
    }

  return (
    <div className="modal fade bd-example-modal-lg" id='dialogoNuevaCategoria' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
    <input type='hidden' id='inputReiniciarCategorias' onClick={params.reiniciarCategorias}/>    
    <div className="modal-dialog modal-lg"> 
        <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Nueva categoria</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
         </div> 
            <div className='container' style={{margin: '0.2em'}}>
                <input onChange={cambioNombre} className='form-control' type="text" placeholder='Nombre categoria'/>
                <br/>
                <div style={{padding: '0.2em'}} className='row border'>     
                     
                    <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                        <input data-toggle="tooltip" title="Ingresa imagenes con fondo blanco, aprox 500x500 mp." type="file"  id="fileImg" onChange={mostrarImagen}/>
                    </div>
                    <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                        <img id="ingresarImg" width="140px" height="150px" src={process.env.REACT_APP_URL_IMAGES+'Imagenes_config/noPreview.jpg'}/>
                    </div>
                    <br/>
                </div>
                    <div style={{marginTop: '0.4em'}} className="col text-center">
                        <button onClick={fetchNuevaCategoria} id="btnIngresar" style={{display:'inline'}} className="btn btn-success">Crear categoria</button>
                        <button id='btnLoading' style={{display:'none', backgroundColor:'red'}} className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                        </button>
                    </div>
                <br/>
            </div>
        </div>
     </div>
    </div>
  )
}

export default NuevaCategoria