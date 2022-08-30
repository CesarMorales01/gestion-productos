import React from 'react'
import { useState, useEffect } from 'react';

const Telefonos = (params) => {
    const [telefonos, setTelefonos] = useState([])

    useEffect(() => {
        if(telefonos.length==0){
          setTelefonos(params.telefonos)
        }
    }, [])

  return (
    <div>
       {telefonos.map((item, index)=>{
        return(
            <h6 key={index}><strong>&#10059;</strong>{item}</h6>
        )
       })}  
    </div>
  )
}

export default Telefonos