import {BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Categorias from "./js/categorias/Categorias";
import './css/general.css'
import Productos from "./js/productos/Productos";
import { useState, useEffect } from 'react';
import NewProduct from "./js/productos/NewProduct";
import GlobalFunctions from '../src/services/GlobalFunctions'
import Login from "./js/IUGeneral/Login";
import Promociones from "./js/promociones/Promociones";
import ListaCompras from "./js/compras/ListaCompras";
import Preguntas from "./js/preguntas/Preguntas";
import Clientes from "./js/clientes/Clientes";
import NewClient from "./js/clientes/NewClient";
import NuevaCompra from "./js/compras/NuevaCompra";

function App() {

 const glob= new GlobalFunctions()
 const [btnTogglerActive, setBtnTogglerActive] = useState(false)
 const [productoEditar, setProductoEditar] = useState({})
 const [productos, setProductos] = useState([])
 const [categorias, setCategorias] = useState([])
 const [lista, setLista] = useState([])
 const [cargar, setCargar] = useState(true)
 const [datosCliente, setDatosCliente] = useState({})
 const [codigoEditarCliente, setCodigoEditarCliente] = useState('')

 useEffect(() => {
    validarAsesor()
  })

 useEffect(() => {
    if(cargar){
      fetchProductos()
      fetchDatos()
      fetchCategorias()
    }
  },[productos, categorias, lista])

  function setListaCeroProductos(){ 
    const objeto={'nombre': ''}
    const arrayNombre=[]
    arrayNombre.push(objeto)
          const obj={
            nombre: 'No hay productos',
            categoria: '',
            descripcion: '',
            valor: '',
            lista_imagenes: arrayNombre
          }
    const array = []
    array.push(obj)
    setProductos(array)
}

function setListaCeroCategorias(){ 
        const obj={
          nombre: 'No hay categorias!!!',
          imagen: ''
        }
  const array = []
  array.push(obj)
  setCategorias(array)
}

  function fetchDatos(){
    const urlDatos = glob.URL_SERV+"datos.php";
    fetch(urlDatos).then((response) => {
      return response.json()
    })
    .then((json) => {
        setCargar(false)
        setLista(json)
      if(json[0].otros!=glob.getCookie('versionApp')){
        glob.setCookie('versionApp', json[0].otros, glob.setExpires('1'))
        borrarCache()
      }
    })
   }  

function validarAsesor(){
    if(glob.getCookie('usuario') ==null || glob.getCookie('usuario')==''){
        if(document.getElementById('linkLogin')!=null){
          document.getElementById('linkLogin').click()
        }
    }
}

function fetchCategorias(){
  const urlDatos = glob.URL_SERV+"get_categorias.php?code=cate";
  fetch(urlDatos).then((response) => {
    return response.json()
  })
  .then((json) => {
    if(json.length==0){
      setListaCeroCategorias()
    }else{
      setCategorias(json)
    }
    
  })
}

function goClientes(){
  document.getElementById('linkClientes').click()
}

// function para forzar cache y actualizar app
function borrarCache(){
  if('caches' in window){
  caches.keys().then((names) => {
          // Delete all the cache files
          names.forEach(name => {
              caches.delete(name);
          })
      });
      window.location.reload(true);
  }
}

function fetchProductos(){
    const urlDatos = glob.URL_SERV+"get_productos.php?code=all";
    fetch(urlDatos).then((response) => {
      return response.json()
    })
    .then((json) => {
      if(json.length==0){
        setListaCeroProductos()
      }else{
        setProductos(json)
      }
    })
}

function activarBtn(){
    if(btnTogglerActive){
      setBtnTogglerActive(false)
    }else{
      setBtnTogglerActive(true)
    }
}

function hideBar(){
    if(btnTogglerActive){
        document.getElementById('btnToggler').click()
    }
}

function irEditarProducto(item){
  console.log(item)
    setProductoEditar(item)
    setTimeout(() => {
       document.getElementById('linkNewProduct').click() 
    }, 100);
}

function irEditarCliente(item, codigoEditar){
   setCodigoEditarCliente(codigoEditar)
   setDatosCliente(item)
   setTimeout(() => {
    document.getElementById('linkNewClient').click()
   }, 100);
}

function goHome(){
  document.getElementById('linkHome').click()
  window.location.href= lista[0].otros2
}

function salir(){
    glob.setCookie('usuario', '', glob.setExpires('-1'))
    glob.setCookie('clave', '', glob.setExpires('-1'))
    const array=[]
    setProductos(array)
}

function regresarProductos(){
  const array=[]
  setProductos(array)
  setTimeout(() => {
      document.getElementById('linkHome').click()
  }, 100);
}

function reiniciarProductos(){
  const array=[]
  setProductos(array)
}

function reiniciarCategorias(){
  const array=[]
  setCategorias(array)
}

function newClient(datosCliente, codigoEditar){
  setCodigoEditarCliente(codigoEditar)
  setDatosCliente(datosCliente)
  document.getElementById('linkNewClient').click()
}

function nuevaCompra(){
  document.getElementById('linkNewBuy').click()
}

function goCompras(){
  document.getElementById('linkCompras').click()
}

function goCartera(){
  document.getElementById('linkHome').click()
  window.location.href='https://tucasabonita.site/lobby_casa_bonita/Form_Cuadrar_cuentas.php'
}

  return (
    <Router> 
    <div > 
      <nav className="navbar navbar-expand-md fondoRojo">
        <div onClick={validarAsesor} className="container">	
            <button id='btnToggler' onClick={activarBtn} className="navbar-toggler" type="button" data-toggle="collapse" data-target="#opciones">
               <span className="navbar-toggler-icon"><i className="fas fa-bars"></i></span>
            </button> 
            <Link to="/" id="linkHome"  className="navbar-brand cursorPointer"  > <img width="60" src={require('./BasicImages/logo192.png')} height="60"/>
            </Link>
            <div className="collapse navbar-collapse" id="opciones">
                    <ul onClick={hideBar} className="navbar-nav centrarAuto">
                        <li className="nav-item">
                            <Link className="nav-link colorBlanco fontSizeNormal" id='linkHome' to="/"><i className="fas fa-box-open"></i> Productos</Link> 
                        </li>
                        <div className="dropdown-divider"></div>
                        <li className="nav-item">
                            <Link className="nav-link colorBlanco fontSizeNormal" id='linkCategorias' to="/categorias"><i className="fas fa-align-justify"></i> Categorias</Link> 
                        </li>   
                        <div className="dropdown-divider"></div>
                        <li className="nav-item">
                            <Link className="nav-link colorBlanco fontSizeNormal" id='linkPromociones' to="/promociones"><i className="fab fa-adversal"></i> Promociones</Link>
                        </li>                    
                        <div className="dropdown-divider"></div>
                        <li className="nav-item">
                            <Link className="nav-link colorBlanco fontSizeNormal" id='linkClientes' to="/clientes"><i className="fas fa-user-friends"></i> Clientes </Link>
                        </li>   
                        <li className="nav-item">
                           <a onClick={goCartera} style={{cursor: 'pointer'}}  className="nav-link colorBlanco fontSizeNormal"><i className="fas fa-user-friends"></i> Cartera</a>
                        </li>                 
                        <div className="dropdown-divider"></div>
                        <li className="nav-item">
                            <Link className="nav-link colorBlanco fontSizeNormal" id='linkCompras' to="/compras"><i className="fas fa-shopping-cart"></i> Compras</Link>
                        </li>                    
                        <div className="dropdown-divider"></div>
                        <li className="nav-item">
                            <Link className="nav-link colorBlanco fontSizeNormal" id='linkPreguntas' to="/preguntas">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-lg" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14Z"/>
                                </svg> 
                                Preguntas
                            </Link>
                        </li>                    
                        <div className="dropdown-divider"></div>
                        <li className="nav-item">
                            <button onClick={salir} className="btn btn-danger">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-power" viewBox="0 0 16 16">
                                    <path d="M7.5 1v7h1V1h-1z"/>
                                    <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z"/>
                                </svg> 
                                <span style={{marginLeft: '0.2em'}}>Salir</span> 
                            </button>
                        </li>	 
                    </ul> 
                    <Link id="linkNewProduct" to="/newProduct"></Link> 
                    <Link id="linkLogin" to="/login"></Link>
                    <Link id="linkNewClient" to="/newClient"></Link> 
                    <Link id="linkNewBuy" to="/newBuy"></Link>    
            </div>        
        </div>
        </nav>
            <Routes>
                <Route path="/" element={<Productos irEditar={irEditarProducto} productos={productos}/>} /> 
                <Route path="/categorias" element={<Categorias categorias={categorias} reiniciarCategorias={reiniciarCategorias} productos={productos}/>} />
                <Route path="/newProduct" element={<NewProduct producto={productoEditar} categorias={categorias} regresarProductos={regresarProductos} reiniciarProductos={reiniciarProductos}/>} />
                <Route path="/login" element={<Login regresarInicio={goHome} datos={lista}/>} />
                <Route path="/promociones" element={<Promociones productos={productos}/>} /> 
                <Route path="/clientes" element={<Clientes newClient={newClient} irEditar={irEditarCliente}/>} />
                <Route path="/compras" element={<ListaCompras nuevaCompra={nuevaCompra}/>} />
                <Route path="/newBuy" element={<NuevaCompra goCompras={goCompras} lista={lista} productos={productos}/>} /> 
                <Route path="/preguntas" element={<Preguntas />} /> 
                <Route path="/newClient" element={<NewClient datosCliente={datosCliente} codigoEditarCliente={codigoEditarCliente} goClientes={goClientes}/>} />             
          </Routes>    
    </div>
  </Router>
  );
}

export default App;
