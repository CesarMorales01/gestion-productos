import GlobalFunctions from '../services/GlobalFunctions'

class FetchService{
  glob= new GlobalFunctions()

  getDatosCliente = async () => {
    let content = [];
    const url = this.glob.URL_SERV+'get_clientes.php?modo=datosCliente&usuario='+this.glob.getCookie('correo')+'&clave='+this.glob.getCookie('clave')
    const respuesta = await fetch(url);
    const data = await respuesta.json();
    data.forEach(element => {
      content.push(element)
    });
    return content;
  }

}

export default FetchService