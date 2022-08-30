import React from 'react'
import GlobalFunctions from '../../services/GlobalFunctions'
import { useState, useEffect } from 'react';
import SelectClientes from './SelectClientes';
import ShoppingCart from './ShoppingCart';
import SelectProductos from './SelectProductos';

const NuevaCompra = (params) => {
    const glob= new GlobalFunctions()
    const [ciudades, setCiudades]= useState([])
    const [departamentos, setDepartamentos]= useState([])
    const [clients, setClients] = useState([])
    const [cargarClientes, setCargarClientes] = useState(true)
    const [mostrarAlerta, setMostrarAlerta] = useState('none')
    const [mensaje, setMensaje] = useState('')
    const [mostrarLoading, setMostrarLoading] = useState(true)
    const [datosCompra, setDatosCompra] = useState({
      cliente: '',
      nombreCliente: '',
      //compra n se calcula en el servidor...
      compra_n: '',
      fecha: '',
      total_compra: 0,
      domicilio: 0,
      medio_de_pago: 'Contraentrega',
      costo_medio_pago: 0,
      comentarios: '',
      cambio: '',
      estado: 'Recibida',
      vendedor: '',
      listaProductos: []
    })

    useEffect(() => {
        if(cargarClientes){
          fetchClientesRegistroCompleto()
          fetCiudades()
          fetDeptos()
          fecha_prest()
        }
    })

    useEffect(() => {
      if(datosCompra.listaProductos.length>0){
        calcularTotales(datosCompra.listaProductos)
        setCheckedRadioPagos()
      }
    }, [datosCompra.medio_de_pago])

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

    function calcularTotales(prods){
      let totales={
        subtotal: 0,
        costoEnvio: 0,
        costoMedioPago: 0
      }
      // subtotal
      for(let i=0; i<prods.length; i++){
          totales.subtotal=totales.subtotal+prods[i].cantidad*prods[i].precio
      }
      //costo envio
      totales.costoEnvio=getCostoEnvio(totales.subtotal)
      totales.costoMedioPago=totalizarModoDepago(totales.subtotal)
      setDatosCompra((valores) => ({
        ...valores,
        domicilio: totales.costoEnvio,
        total_compra: totales.subtotal,
        costo_medio_pago: totales.costoMedioPago
      }))
    }

    function totalizarModoDepago(subtotal){
      setCheckedRadioPagos()
      let costoModoPago=0;
      if(datosCompra.medio_de_pago=='Contraentrega'){
         // referencia es pago contraentrega y cantidad costo pasarela de pagos...
        costoModoPago=parseFloat(params.lista[0].referencia)*parseFloat(subtotal)
      }else{
        costoModoPago=parseFloat(params.lista[0].cantidad)*parseFloat(subtotal)
      }
      return costoModoPago;
    }

    function setCheckedRadioPagos(){
      if(datosCompra.medio_de_pago==='Contraentrega'){
        document.getElementById('contraentrega').checked = true
        document.getElementById('wompi').checked = false
      }else{
        document.getElementById('wompi').checked = true
        document.getElementById('contraentrega').checked = false
      }
    }

    function getCostoEnvio(sub){
      let envio=0;
      if(datosCompra.cliente!=''){
        setMensaje('')
        setMostrarAlerta('none')
        envio=totalizarCostoEnvio(sub)
      }else{
        setMensaje('Seleccionar un cliente para calcular el envio!')
        setMostrarAlerta('inline')
      }
      return envio
    }

    function totalizarCostoEnvio(subto){
      let envio=0;
      let ciudadEnvio=buscarCiudad();
      if(ciudadEnvio.toUpperCase()=='BUCARAMANGA' || ciudadEnvio.toUpperCase()=='GIRON' || ciudadEnvio.toUpperCase()=='FLORIDABLANCA'){
        if(subto>100000){
          envio=0
        }else{
          envio=params.lista[0].imagen
        }
      }else{
        envio=params.lista[0].precio
      }
      return envio
    }

    function buscarCiudad(){
      let ciudad=''
      for(let i=0; i<ciudades.length; i++){
        if(ciudades[i].codigo===buscarCliente().ciudad){
          ciudad=ciudades[i].nombre
        }
      }
      return ciudad
    }

    function buscarCliente(){
      let cliente={}
      for(let i=0; i<clients.length; i++){
        if(datosCompra.cliente===clients[i].cedula){
          cliente=clients[i]
        }
      }
      return cliente
    }

    function fetchClientesRegistroCompleto(){
        const url = glob.URL_SERV+"get_clientes.php?modo=getAll"
        fetch(url).then((response) => {
          return response.json()
        })
        .then((json) => {
            setCargarClientes(false)
            setMostrarLoading(false)
            setClients(json)
        })     
    }

    function fecha_prest() {
        var fecha = new Date(); //Fecha actual
        var mes = fecha.getMonth()+1; //obteniendo mes
        var dia = fecha.getDate(); //obteniendo dia
        var ano = fecha.getFullYear(); //obteniendo año
        if(dia<10)
          dia='0'+dia; //agrega cero si el menor de 10
        if(mes<10)
          mes='0'+mes //agrega cero si el menor de 10
          document.getElementById('inputDate').value=ano+"-"+mes+"-"+dia
          setTimeout(() => {
            if(datosCompra.fecha===''){
              setDatosCompra((valores) => ({
                ...valores,
                fecha: ano+"-"+mes+"-"+dia
              }))
            }
          }, 100);
    }

    function getCliente(e){
      let nombre=''
      let cedula=''
      for(let i=0; i<clients.length; i++){
        if(e.target.value==clients[i].cedula){
          nombre=clients[i].nombre
          cedula=clients[i].cedula
        }
      }
      setDatosCompra((valores) => ({
        ...valores,
        cliente: cedula,
        nombreCliente: nombre
      }))
    }

    function cambioFecha(e){
      setDatosCompra((valores) => ({
        ...valores,
        fecha: e.target.value
      }))
    }

    function validarDatosVacio(){
      if(datosCompra.cliente==='' || datosCompra.total_compra===0 || datosCompra.listaProductos.length===0){
        setMensaje('Faltan datos importantes!')
        setMostrarAlerta('inline')
      }else{
        setMensaje('')
        setMostrarAlerta('none')
        fetchIngresarCompra()
      }
    }

    function loadingOn(){
      document.getElementById('btnIngresarCompra').style.display='none'
      document.getElementById('btnLoading').style.display='inline'
    }

    function fetchIngresarCompra(){
      loadingOn()
      let url=glob.URL_SERV+"get_compras.php?modo=ingresarCompraAdmin"
      fetch(url, {
          method: 'POST',
          body: JSON.stringify(datosCompra),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      .then((response) => {
          return response.json()
      }).then((json) => {
        if(json.listaCompras==='Registro en lista compras'){
          setMensaje('Compra registrada!')
          setMostrarAlerta('inline')
          setTimeout(() => {
            document.getElementById('inputGoCompras').click()
          }, 100);
        }
      })
    }

    function cambiarModoPago(metodo){
      setDatosCompra((valores) => ({
        ...valores,
        medio_de_pago: metodo
      }))
    }

  function getProducto(e){
        let nombre=''
        let precio=0
        for(let i=0; i<params.productos.length; i++){
          if(e.target.value==params.productos[i].codigo){
            nombre=params.productos[i].nombre
            precio=params.productos[i].precio
          }
        }
        let array=datosCompra.listaProductos
        let objeto={
          codigo: e.target.value,
          nombre: nombre,
          cantidad: 1,
          precio: precio 
        }
        array.push(objeto)
        reiniciarProductos()
        setTimeout(() => {
          setDatosCompra((valores) => ({
            ...valores,
            listaProductos: array
          }))
          calcularTotales(array)
        }, 100); 
  }

  function reiniciarProductos(){
    let reiniciar=[]
    setDatosCompra((valores) => ({
      ...valores,
      listaProductos: reiniciar
    }))
  }

  function borrarProducto(id){
    let array=datosCompra.listaProductos
    reiniciarProductos()
    setTimeout(() => {
      const temp = array.filter((art)=>art.codigo !== id);
      setDatosCompra((valores) => ({
        ...valores,
        listaProductos: temp
      }))
      // Paso array temp a calcularTotales porque setDatosCompra demora un poco en actualizar....
      calcularTotales(temp)
    }, 100);
  }
  
  function validarcantidad(id){
    let validarCantidad=0
      for (let i=0; i<datosCompra.listaProductos.length; i++){
        if(datosCompra.listaProductos[i].codigo===id){
          validarCantidad=datosCompra.listaProductos[i].cantidad
        }
      }
    return validarCantidad  
  }
  
  function menosCant(id){
      if(validarcantidad(id)>1){
        const temp=datosCompra.listaProductos 
        reiniciarProductos()
        setTimeout(() => {
          const updatedArray = temp.map(p =>
            p.codigo === id ? { ...p, cantidad: p.cantidad-1 }
              : p
          )
          setDatosCompra((valores) => ({
            ...valores,
            listaProductos: updatedArray
          }))
          calcularTotales(updatedArray)
        }, 100);
      }
  }

  function masCant(id){
    if(validarcantidad(id)<6){
      const temp=datosCompra.listaProductos 
      reiniciarProductos()
      setTimeout(() => {
        const updatedArray = temp.map(p =>
          p.codigo === id ? { ...p, cantidad: p.cantidad+1 }
            : p
        )
        setDatosCompra((valores) => ({
          ...valores,
          listaProductos: updatedArray
        }))
        calcularTotales(updatedArray)
      }, 100);
    }
}

function cambioCostoEnvio(e){
  setDatosCompra((valores) => ({
    ...valores,
    domicilio: e.target.value,
  }))
}

function validarCliente(){
    getCostoEnvio(datosCompra.total_compra)
}

function cambioCostoMedioPago(e){
  setDatosCompra((valores) => ({
    ...valores,
    costo_medio_pago: e.target.value,
  }))
}

function cambioComentario(e){
  setDatosCompra((valores) => ({
    ...valores,
    comentarios: e.target.value,
  }))
}

  return (
    <div className="container">
      <input id='inputGoCompras' type='hidden' onClick={params.goCompras}></input>
        <div style={{marginTop: '0.2em'}} className='row justify-content-center'>
            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
                <p id="inputMessage" style={{textAlign: 'justify', color: 'red', display: mostrarAlerta, marginTop: '0.2em'}}>{mensaje}</p>
                <h6 style={{marginTop: '0.2em'}}>Fecha de compra:</h6>
                <input type="date" onChange={cambioFecha} name="fecha_prest" id="inputDate"/>
                <br/><br/>
                <p style={{textAlign: 'justify', color: 'black'}}>Seleccionar cliente</p>
                <SelectClientes getCliente={getCliente} clientes={clients}/>
                <input type="text" style={{marginTop: '0.2em'}} readOnly  id='inputNombre' className="form-control" value={datosCompra.nombreCliente=='' ? '' : datosCompra.nombreCliente}/>
                <br/>
                <p style={{textAlign: 'justify', color: 'black'}}>Seleccionar productos</p>
                <div onMouseOver={validarCliente}>  
                  <SelectProductos  obtenerProducto={getProducto} productos={params.productos}/>
                  <ShoppingCart masCant={masCant} menosCant={menosCant} borrarProducto={borrarProducto} productosCarrito={datosCompra.listaProductos}/>	
                </div>
                <textarea placeholder='Comentarios...' onChange={cambioComentario} className="form-control" value={datosCompra.comentarios}></textarea>			     
            </div>

            <div className='col-lg-6 col-md-6 col-sm-12 col-12'>
               <div  style={{textAlign: 'center', marginTop: '0.2em'}} className="border border-success">
                <br/>
                  <h6 style={{textAlign: 'center'}}>Valor total productos</h6>
                  <h6 style={{color: 'green', textAlign: 'center'}}>$ {glob.formatNumber(datosCompra.total_compra)}</h6>
                  <hr style={{height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray'}}></hr>
                  <h6>Costo envio</h6>
                  <input className="form-control" type={'number'} onChange={cambioCostoEnvio} min="0" max="1000000" value={datosCompra.domicilio}></input>
                  <h6 style={{texAlign: 'center', marginTop: '0.4em'}}>Total con envio</h6>
                  <h6 style={{color: 'green', textAlign: 'center'}}>$ {glob.formatNumber(parseInt(datosCompra.total_compra)+parseInt(datosCompra.domicilio))}</h6>
                  <hr style={{height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray'}}></hr>
                  <h6>Medio de pago</h6>
                  <div className='row container'>
                    <div onClick={()=>cambiarModoPago('Contraentrega')} style={{padding: '1vh', cursor: 'pointer'}} className="container card col-6" >
                        <span>Contraentrega </span>
                        <input type="radio"  id="contraentrega" name="medio_pago" value="contraentrega"/>
                    </div>
                    <div onClick={()=>cambiarModoPago('Electronico')} style={{padding: '1vh', cursor: 'pointer'}} className="container card col-6" >
                         Pago en línea
                        <input  type="radio" id="wompi" name="medio_pago" value="wompi"/>
                    </div>
                  </div>
                        <br/>
                        <h6 style={{textAlign: 'center'}}>Costo medio de pago</h6>
                        <input type='number' className="form-control" onChange={cambioCostoMedioPago} style={{color: 'green', textAlign: 'center'}} value={datosCompra.costo_medio_pago}></input>
                        <hr style={{height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray'}}></hr>

                        <h5 style={{textAlign: 'center'}}>Total a pagar</h5>
                        <h5 style={{color: 'green', textAlign: 'center'}}>$ {glob.formatNumber(parseInt(datosCompra.total_compra)+parseInt(datosCompra.domicilio)+parseInt(datosCompra.costo_medio_pago))}</h5>
                      </div>
            </div>
            <div style={{marginTop: '0.2em'}} align='center' className='container'>
              <button id='btnIngresarCompra' style={{display: mostrarLoading ? 'none' : 'inline'}} className='btn btn-success' onClick={validarDatosVacio}>Ingresar compra</button>
              <button id='btnLoading' style={{display: mostrarLoading ? 'inline' : 'none', backgroundColor:'gray'}} className="btn btn-primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Loading...
              </button>
            </div>
            
        </div>
    </div>
  )
}

export default NuevaCompra