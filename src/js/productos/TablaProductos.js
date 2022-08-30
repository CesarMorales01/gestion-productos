import React from 'react'
import '../../css/general.css'

const TablaProductos = (params) => {

function formatNumber(num){
        return new Intl.NumberFormat("de-DE").format(num)
}

  return (
    <div className='container table-responsive'>
    <table className="table table-striped">
      <thead>
              <tr>
                <th scope="col">Codigo</th>
                <th scope="col">Categoria</th>
                <th scope="col">Nombre</th>
                <th scope="col">Descripcion</th>
                <th scope="col">Precio</th>
              </tr>
      </thead>
      <tbody>
    {params.productos.map((item, index)=>{

      return(
        <tr key={index}>
          <th scope="row">
            {item.codigo}
            <br/>
            <span onClick={()=>params.irEditar(item)} className='border border-dark rounded cursorPointer' style={{padding: '0.2em', backgroundColor: '#f0e094'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                </svg>
            </span>
          </th>
          <td>{item.categoria}</td>
          <td>{item.nombre}</td>
          <td>
            <div className='divScroll'>
                {item.descripcion}
            </div>
          </td>
          <td>{formatNumber(item.precio)}</td>
        </tr>
      )
    })}
    </tbody>
    </table>
  </div>
  )
}

export default TablaProductos