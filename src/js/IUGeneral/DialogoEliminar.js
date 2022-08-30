import React from 'react'

const DialogoEliminar = (params) => {

  return (
    <div className="modal fade" id="dialogoEliminar" tabIndex="-1" aria-labelledby="exampleModalLabel"   aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{params.titulo}</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
            <div className="modal-footer">
              <button type="button" style={{display: params.display}} className="btn btn-secondary" data-bs-dismiss="modal" >Cancelar</button>
              <button type="button" onClick={params.accion} className="btn btn-danger">{params.textoConfirmar}</button>
            </div>
      </div>
    </div>
  </div>
  )
}

export default DialogoEliminar