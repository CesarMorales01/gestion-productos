import React from 'react'
import Cargando from '../IUGeneral/Cargando'
import GlobalFunctions from '../../services/GlobalFunctions'
import { useState, useEffect } from 'react';
import SelectMunicipios from '../clientes/SelectMunicipios'
import DialogoAgregarTel from '../clientes/DialogoAgregarTel'
import DialogoEliminar from '../IUGeneral/DialogoEliminar';

const NewClient = (params) => {
    const glob= new GlobalFunctions()
    const [newDatosPersonales, setNewDatosPersonales]= useState({
        nombre: '',
        apellidos: '',
        cedula: '',
        usuario: '',
        clave: '',
        correo: '',
        direccion: '',
        info_direccion: '',
        ciudad: '',
        departamento: '',
        otros: '',
        telefonos: [],
        fecha: glob.getFecha()
    })
    const [ciudades, setCiudades]= useState([])
    const [departamentos, setDepartamentos]= useState([])
    const [codigoEditar, setCodigoEditar]= useState('')
    validarParametros()

    useEffect(()=>{
        fetCiudades()
        fetDeptos()
    }, [ciudades])

    function validarParametros(){
        if(Object.keys(params.datosCliente).length>0 && codigoEditar==''){
            setCodigoEditar(params.codigoEditarCliente)
            setNewDatosPersonales(params.datosCliente)
            clickInputCiudad()
        }
    }

    function clickInputCiudad(){
        setTimeout(() => {
            if(document.getElementById('inputCiudad')!=null){
                document.getElementById('inputCiudad').click()
            }else{
                clickInputCiudad()
            }
        }, 200);
    }

    function fetCiudades(){
        if(ciudades.length==0){
            let url=glob.URL_SERV+"getMunicipiosDeptos.php?modo=municipios"
            fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                setCiudades(json)
            }) 
        }
    }

    function fetDeptos(){
        if(departamentos.length==0){
            let url=glob.URL_SERV+"getMunicipiosDeptos.php?modo=departamentos"
            fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                setDepartamentos(json)
            }) 
        }
    }

    function cambioNombre(e) {
        setNewDatosPersonales((valores) => ({
          ...valores,
          nombre: e.target.value,
        }))
    }

    function cambioApellidos(e) {
        setNewDatosPersonales((valores) => ({
          ...valores,
          apellidos: e.target.value,
        }))
    }

    function cambioCedula(e) {
        setNewDatosPersonales((valores) => ({
          ...valores,
          cedula: e.target.value,
        }))
    }

    function cambioCorreo(e) {
        setNewDatosPersonales((valores) => ({
          ...valores,
          correo: e.target.value,
        }))
    }

    function cambioDireccion(e) {
        setNewDatosPersonales((valores) => ({
          ...valores,
          direccion: e.target.value,
        }))
    }

    function cambioInfoDireccion(e) {
        setNewDatosPersonales((valores) => ({
          ...valores,
          info_direccion: e.target.value,
        }))
    }

    function cambioCiudad(e) {
        let codCiudad=0
        let nombreCiudad=''
        let codDepto=0
        let nombreDepto=''
        for(let i=0; i<ciudades.length;i++){  
            if(ciudades[i].codigo==e.target.value){
                codCiudad=ciudades[i].codigo;
                nombreCiudad=ciudades[i].nombre
                codDepto=ciudades[i].referencia
            }
        }
        for(let i=0; i<departamentos.length;i++){  
            if(departamentos[i].codigo==codDepto){
                nombreDepto=departamentos[i].nombre
            }
        }
        document.getElementById('inputCiudad').value=nombreCiudad
        document.getElementById('inputDepartamento').value=nombreDepto
        setNewDatosPersonales((valores) => ({
          ...valores,
          ciudad: codCiudad,
          departamento: codDepto
        }))
    }

    function setCiudad(){
        let codCiudad=0
        let nombreCiudad=''
        let codDepto=0
        let nombreDepto=''
        for(let i=0; i<ciudades.length;i++){ 
            if(ciudades[i].codigo==newDatosPersonales.ciudad){
                codCiudad=ciudades[i].codigo;
                nombreCiudad=ciudades[i].nombre
                codDepto=ciudades[i].referencia
            }
        }
        for(let i=0; i<departamentos.length;i++){  
            if(departamentos[i].codigo==codDepto){
                nombreDepto=departamentos[i].nombre
            }
        }
        document.getElementById('inputCiudad').value=nombreCiudad
        document.getElementById('inputDepartamento').value=nombreDepto
    }

    function cambioUsuario(e) {
        setNewDatosPersonales((valores) => ({
          ...valores,
          usuario: e.target.value,
        }))
    }

    function cambioClave(e) {
        setNewDatosPersonales((valores) => ({
          ...valores,
          clave: e.target.value,
        }))
    }

    function borrarTelefono(tel){
        const temp = newDatosPersonales.telefonos.filter((art)=>art !== tel);
        setNewDatosPersonales((valores) => ({
            ...valores,
            telefonos: temp
        }))
    }

    function cerrarDialogoNewTel(){
        document.getElementById('btnCerrarDialogoNewTel').click()
    }

    function agregarTelefono(e){
        cerrarDialogoNewTel() 
        let array=[]
        setNewDatosPersonales((valores) => ({
          ...valores,
          telefonos: array
       }))
        let tels = newDatosPersonales.telefonos
        tels.push(e.target.value)
        setTimeout(() => {
          setNewDatosPersonales((valores) => ({
              ...valores,
              telefonos: tels
          }))
        }, 100);
      }

    function loadingOn(){
        document.getElementById('btnModificarUsuario').style.display='none'
        document.getElementById('btnLoadingUsuario').style.display='inline'
    }  

    function loadingOff(){
        document.getElementById('btnModificarUsuario').style.display='inline'
        document.getElementById('btnLoadingUsuario').style.display='none'
    }

    function registrarCliente(){
        const url = glob.URL_SERV+'get_clientes.php?modo=registrarClienteAdmin'
        loadingOn()
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(newDatosPersonales),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          return response.json()
        }).then((json) => { 
            if(json.usuario=='Registro'){
                document.getElementById('inputGoClientes').click()
            }else{
                alert('Ha ocurrido un error en el registro!!!')
            } 
        })
    }

    function validarInfoDivUsuario(){  
            if(validarDatosVaciosDir()){  
                if(newDatosPersonales.nombre=='' || newDatosPersonales.cedula==''){
                    document.getElementById('alert_faltante').innerText="Falta información importante!"
                }
            }else{
                document.getElementById('alert_faltante').innerText=""
                if(codigoEditar==''){
                    registrarCliente()
                }else{
                    if(codigoEditar!=''){
                        actualizarDatosConCedula()
                    }
                }
            }   
    }

    function actualizarDatosConCedula(){
        const url = glob.URL_SERV+'get_clientes.php?modo=actualizarCliente'
        newDatosPersonales.nuevoUsuario=newDatosPersonales.usuario
        loadingOn()
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(newDatosPersonales),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          return response.json()
        }).then((json) => { 
            loadingOff()
            setAlertActualizado('Datos de cliente actualizados!')
        })
    }

    function setAlertActualizado(mensaje){
        document.getElementById('alert_faltante').innerText=mensaje
        document.getElementById('alertFaltanteUsuario').innerText=mensaje
        document.getElementById('alertFaltanteDireccion').innerText=mensaje
    }    

    function validarDatosVaciosDir(){
        let vacios=true
        if(newDatosPersonales.usuario=='' || newDatosPersonales.clave==''){
            document.getElementById('alertFaltanteUsuario').innerText="Falta información importante!"
            vacios=true
        }else{
            document.getElementById('alertFaltanteUsuario').innerText=""
            if( newDatosPersonales.direccion=='' || newDatosPersonales.ciudad=='' || newDatosPersonales.telefonos.length==0){
                document.getElementById('alertFaltanteDireccion').innerText="Falta información importante!"
                vacios=true
            }else{
                document.getElementById('alertFaltanteDireccion').innerText="" 
                vacios=false
            } 
        }
        return vacios
    }

    function fetchBorrar(){
        document.getElementById('btnDialogoEliminar').click()
        loadingOn()
        const url = glob.URL_SERV+'get_clientes.php?modo=borrarCliente&cedula='+newDatosPersonales.cedula+'&correo='+newDatosPersonales.correo
        fetch(url)
        .then((response) => {
          return response.json()
        }).then((json) => { 
            if(json.cliente=='Eliminado' && json.usuario=='Eliminado'){
                setAlertActualizado('Cliente eliminado!')
                setTimeout(() => {
                    document.getElementById('inputGoClientes').click()
                }, 300); 
            }
        })
    }

  if(ciudades.length>0){
    return (
        <div className="container">
                <input type='hidden' id='inputGoClientes' onClick={params.goClientes} />
                {/* datos personales*/}
                <div id="div_datos_personales" style={{backgroundColor: '#f4f4f4', padding: '0.4em'}}>
                    <div className="row justify-content-center" >
                    <p id="alert_faltante" style={{textAlign: 'justify', color: 'red'}}></p>		  
                        <div className="col-lg-4 col-sm-12" > 
                            <strong style={{fontSize: '1em'}} >Datos personales</strong>
                            <br/>		 
                            <p style={{textAlign: 'justify', color: 'black'}}>Nombres</p>
                            <input type="text" onChange={cambioNombre}  id='inputNombre' className="form-control" value={newDatosPersonales.nombre=='' ? '' : newDatosPersonales.nombre}/>
                            <br/>				
                        </div> 
                        
                        <div className="col-lg-4 col-sm-12" >
                             <br/>
                            <p style={{textAlign: 'justify', color: 'black'}}>Apellidos</p>
                            <input type="text" onChange={cambioApellidos} id='inputApellidos' className="form-control" value={newDatosPersonales.apellidos=='' ? '' : newDatosPersonales.apellidos}/> 
                            <br/>
                        </div> 
                    </div>  
                    <div className="row justify-content-center" >	
                        <div className="col-lg-4 col-sm-12" >
                            <p style={{textAlign: 'center', color: 'black'}}>Número de cédula</p>
                        </div> 
                        <div className="col-lg-4 col-sm-12" > 
                            <input readOnly={codigoEditar=='cedula' ? true : false} type="number" id='inputCedula' onChange={cambioCedula} placeholder="Número de cédula" className="form-control" defaultValue={newDatosPersonales.cedula=='' ? '' : newDatosPersonales.cedula}/>
                        </div> 
                    </div> 
                    <br/>   	
                </div>  
                <br/>
                {/* Direccion de envio*/}
                <div style={{backgroundColor: '#f4f4f4', padding: '0.5em'}}>
                <p id="alertFaltanteDireccion" style={{textAlign: 'justify', color: 'red'}}></p>
                    <div className="row justify-content-center" >
                        <div className="col-lg-8 col-sm-12">
                            <strong style={{fontSize: '1em'}} >Dirección de envio</strong>
                            <textarea onChange={cambioDireccion} id='inputDireccion' rows="2" className="form-control" value={newDatosPersonales.direccion=='' ? '' : newDatosPersonales.direccion}></textarea>
                            <br/>
                        </div>
                        <div className="col-lg-8 col-sm-12">
                            <textarea onChange={cambioInfoDireccion}  id="inputInfoDireccion" rows="2" placeholder="Información adicional: apartamento, local, torre, etc. (Opcional)" className="form-control" value={newDatosPersonales.info_direccion=='' ? '' : newDatosPersonales.info_direccion}></textarea>
                            <br/>
                        </div>
                    </div>
    
                    <div style={{width: '80%'}} className='container'>
                         <SelectMunicipios  ciudades={ciudades} className="form-control" getMunicipio={cambioCiudad} />
                    </div>
                    
                    <div style={{textAlign: 'center'}} className="row justify-content-center" >         
                        <div className="col-lg-6 col-md-6 col-sm-6" >
                            <strong style={{fontSize: '1em'}} >Ciudad</strong>
                            <input type="text" onClick={setCiudad} readOnly placeholder="Ciudad"  className="form-control" id="inputCiudad" /> 
                        </div>
                        <br/><br/>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <strong style={{fontSize: '1em'}} >Departamento</strong>
                            <input type="text" readOnly placeholder="Departamento" className="form-control"  id="inputDepartamento" />
                            <br/>
                        </div>  
                    </div>
                   
                    <p style={{textAlign: 'center', color: 'black'}}>Télefonos (<strong style={{color:' red'}}>*</strong>Obligatorio)</p>
                        {/* div telefonos */}
                        <div style={{textAlign: 'center'}} className="container">
                                    <div className="row justify-content-center" >
                                        <input type='hidden' id='inputTelefonos'  />    
                                        {newDatosPersonales.telefonos.map((item, index)=>{
                                            return(       
                                                <div key={index} style={{margin: '1em'}} className="col-lg-2 col-md-2 col-sm-4 col-6 border">      
                                                    <p>{item}</p> 
                                                    <img  onClick={() => borrarTelefono(item)} style={{height:'0.9em', width:'0.9em', cursor: 'pointer', backgroundColor: 'red', padding: '0.1em'}} src={process.env.REACT_APP_URL_IMAGES+'/Imagenes_config/trash.png'}/>
                                                </div>       
                                            )       
                                        })}  
                                   </div>
                                   <button  id='btnCerrarDialogoNewTel' type="button" className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#dialogoNewTel"><i className="fa-solid fa-plus"></i>Nuevo télefono
                                   </button> 
                                   <DialogoAgregarTel cerrarDialogo={cerrarDialogoNewTel} agregarTelefono={agregarTelefono}/>   
                        </div>         
                    {/* fin div telefonos */}               		
                </div>
                <br/>
                 {/* Datos usuario */}  
                <div style={{backgroundColor: '#f4f4f4', padding: '0.3em'}}>
                <p id="alertFaltanteUsuario" style={{textAlign: 'justify', color: 'red'}}></p>
                    <div className="row justify-content-center">
                                <div className="col-lg-8 col-sm-12" >
                                        <strong style={{fontSize: '1em'}} >Datos de cuenta</strong>
                                        <div style={{backgroundColor: '#f4f4f4', padding: '0.3em'}}>
                                            <p style={{textAlign: 'justify', color: 'black'}}>Nombre de usuario</p>
                                        <input type="text" onChange={cambioUsuario} className="form-control"  id="inputUsuario" value={newDatosPersonales.usuario=='' ? '' : newDatosPersonales.usuario}/> 
                                            <br/>
                                            <p  style={{textAlign: 'justify', color: 'black'}}>E-mail</p>
                                            <input type="text" readOnly={codigoEditar=='' ? false : true} onChange={cambioCorreo} className="form-control"  id="inputCorreo" defaultValue={newDatosPersonales.correo=='' ? '' : newDatosPersonales.correo}/> 
                                            <br/>
                                        </div>
                                        <strong style={{fontSize: '1em'}} >Contraseña</strong>
                                        <div style={{backgroundColor: '#f4f4f4', padding: '0.5em'}}>
                                                    <input type="password" onChange={cambioClave} id="inputClave" className="form-control" value={newDatosPersonales.clave=='' ? '' : newDatosPersonales.clave}/>  
                                                    <br/>
                                        </div>    
                                        <div style={{textAlign: 'center'}} className="row justify-content-center">
                                            <div className="col-12" >
                                                <button onClick={validarInfoDivUsuario} style={{backgroundColor: '#f0e094'}} id="btnModificarUsuario"  className="btn btn-outline-success btn-md btn-block" type="button" >{codigoEditar=='' ? 'Crear Cliente' : 'Editar cliente'}<i style={{marginLeft: '1em'}} className="fas fa-edit"></i></button>
                                                <button id='btnLoadingUsuario' style={{display:'none', backgroundColor:'green'}} className="btn btn-primary" type="button" disabled>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Loading...
                                                </button>
                                            </div>
                                            <br/><br/>
                                            <div className="col-12" >
                                                <button style={{display: codigoEditar=='' ? 'none' : 'inline'}} id='btnDialogoEliminar' data-bs-toggle="modal"  data-bs-target="#dialogoEliminar" className="btn btn-danger btn-md btn-block" type="button" >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                    </svg>
                                                </button>
                                                 {/* dialogo eliminar*/}
                                                <DialogoEliminar display={'inline'} accion={fetchBorrar} titulo={'Eliminar este cliente?'} textoConfirmar={'Confirmar'}/>
                                            </div>    
                                        </div>
                                        <br/>
                                </div>	
                                <br/>                             
                    </div>
                </div> 				            
          </div>
      )
  } else{
    return(
        <Cargando />
    )
  } 
}

export default NewClient