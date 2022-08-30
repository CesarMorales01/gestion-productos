import React from 'react'

const Cargando = () => {
  return (
    <div className='container textAlignCenter'>
      <br></br><br></br><br></br>
      <span>Cargando info...</span>
      <br></br>
      <img  src={require('../../BasicImages/loading.gif')} width="100" height="100"></img>
  </div>
  )
}

export default Cargando