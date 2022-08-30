import React from 'react'
import '../../css/login.css'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../../services/GlobalFunctions'

const Login = (params) => {
    const glob= new GlobalFunctions()
    const [contraseña, setContraseña] = useState('')
    const [loginUsuario, setLoginUsuario] = useState('')
    const [keepUsu, setKeepUsu] = useState(false)
    const [notificacion, setNotificacion] = useState(params.notificacion)

    useEffect(()=>{
       checkSetLogin()     
     },[])

     function checkSetLogin(){
        if(glob.getCookie('keepUsu')=='true'){
            setKeepUsu(true)
            setLoginUsuario(glob.getCookie('loginUsuario'))
            setContraseña(glob.getCookie('contraseña'))
        }
     }

    function validarDatos(){
        if(loginUsuario!='' && contraseña!=''){
            consultarServidor()
            setNotificacion('')
            document.getElementById('imgLoading').style.display=''
        }else{
            setNotificacion("No haz ingresado datos!") 
        }
    }

    function consultarServidor(){
        let url=glob.URL_SERV+"getAsesores.php?modo=loginAsesor"
        const datos={
          nombre: loginUsuario,
          clave: contraseña
        }
        fetch(url, {
          method: 'POST',
          body: JSON.stringify(datos),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
            return response.json()
        }).then((json) => {
            validarContraseña(json)
        }) 
    }

    function validarContraseña(js){
      if(js[0].usuario=='No existe'){
        contraseñaIncorrecta()
      }else{
        if(js[0].cedula==contraseña){
          glob.setCookie('usuario', js[0].usuario, glob.setExpires('1'))
          glob.setCookie('clave', js[0].cedula, glob.setExpires('1'))
          document.getElementById('imgLoading').style.display='none'
          document.getElementById('inputRegresarInicio').click()
          checkKeepDatos()
      }else{
         contraseñaIncorrecta() 
      }
      } 
    }

    function contraseñaIncorrecta(){
      setNotificacion('Datos incorrectos!')
      document.getElementById('imgLoading').style.display='none'
    }

    function checkKeepDatos(){
        if(keepUsu){
            glob.setCookie('keepUsu', 'true', glob.setExpires('1'))
            glob.setCookie('loginUsuario', loginUsuario, glob.setExpires('1'))
            glob.setCookie('contraseña', contraseña, glob.setExpires('1'))
        }else{
          glob.setCookie('keepUsu', false, glob.setExpires('-1'))
          glob.setCookie('loginUsuario', '', glob.setExpires('-1'))
          glob.setCookie('contraseña', '', glob.setExpires('-1'))
        } 
    }

    function onChangeUsuario(e){
      setLoginUsuario(e.target.value)
    }

    function onChangeContraseña(e){
        setContraseña(e.target.value)
      }
     
    function mantenerDatos(e){
        setKeepUsu(e.target.checked)
    }  

  return (
 <div className="container">
    <div className="row justify-content-center">  
        <input type='hidden' id='inputHiddenRedirectProduct' onClick={params.goProduct} />   
        <div style={{borderStyle: 'double', borderColor: 'red', marginTop: '4%', textAlign: 'center'}} className="col-lg-6 col-10 login-box">  
            <h2 style={{color: 'black', textAlign: 'center'}} >Hooola! Bienvenid@!</h2>
            <br/>
            <p style={{textAlign: 'center', color: 'red'}} >{notificacion}</p>
            <img id='imgLoading' style={{display:'none'}} src={process.env.REACT_APP_URL_IMAGES+'/Imagenes_config/loading.gif'} width="80" height="80"></img>
            <form style={{textAlign: 'center'}}>
            <br/> 
            <input type="text" id="usuario" onChange={onChangeUsuario} name="user1" required size="50" placeholder="Usuario" value={loginUsuario}/> 
            <br/> <br/> 
            <input type="password" id="clave" onChange={onChangeContraseña} name="contra1" required size="50" placeholder="Clave" value={contraseña} /> 
            <br/> <br/>
            <label style={{color: 'black', cursor: 'pointer'}}>Mantener contraseña:
              <input id="checkbox" checked={keepUsu} onChange={mantenerDatos} type="checkbox" name="save" />
            </label>
            <input type='hidden' id='inputRegresarInicio' onClick={params.regresarInicio} />
            <br/> <br/>
            <input onClick={validarDatos}  style={{backgroundColor: 'green'}} className="btn btn-success btn-md" type="button" value="Ingresar"/> 
            <br/>
            </form>
        </div> 
        <div className="footer-copyright text-center py-3">
        <a >© 2020 Copyright: MadeForYou Version {params.datos.length>0 ? params.datos[0].otros: ''}</a>
        </div>     
    </div>
  </div>
  )
}

export default Login

//