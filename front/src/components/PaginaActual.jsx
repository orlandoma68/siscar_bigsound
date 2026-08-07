import React from 'react'

const PaginaActual = ({totalPaginas, numeroPaginaActual, setNumerPaginaActual,totalProductos }) => {

    const handleNext = ()=>{
      if(numeroPaginaActual !== totalPaginas){setNumerPaginaActual(numeroPaginaActual +1)}
    }
    const handlePrev = ()=>{
      if(numeroPaginaActual !== 1){setNumerPaginaActual(numeroPaginaActual - 1)}
    }

    const cambiarPagina = (numeroPaginaActual1)=>{
      setNumerPaginaActual(numeroPaginaActual1)
    }    

    const numbers = Array.from({ length: totalPaginas }, (_, i) => i + 1); 
        
  return (

      <div className='container'>
          <div className='row'>
              <div className='col-12 col-md-6 col-lg-4 w-100'>
                  <div className='px-5 d-flex justify-content-center align-items-center w-100 cont'>
                    <h3 className='opacity-50 btn btn-outline-primary border-0' onClick={handlePrev} disabled ={numeroPaginaActual === 1} >{'<'}Anterior  </h3>
                    <div className='d-flex justify-content-center'>
                    {numbers.map((num) => (                         
                    <button key= {num} className={`btn px-2 ${numeroPaginaActual === num ? "btn-primary border-0" : "btn-outline-primary border-0"}`} onClick={()=>cambiarPagina(num)}>
                      {num} 
                    </button>
                    ))}
                    </div>
                    <h3 className='opacity-50 btn btn-outline-primary border-0' onClick={handleNext} disabled = {numeroPaginaActual === totalPaginas} >Siguiente{'>'} </h3>
                  </div>
                </div>    
            </div>
          <div className='d-flex justify-content-center'>            
                <p className='btn opacity-50 '>{totalProductos} Productos - Página {numeroPaginaActual} de {totalPaginas} </p>
            </div>
      </div>    
  )
}

export default PaginaActual


{/*
                    {Array.from({length:totalPaginas}, (_, index) => (
                      <button key= {index + 1} className={`btn ${numeroPaginaActual === index + 1 ? "btn-primary border-0" : "btn-outline-primary border-0"}`} onClick={()=>cambiarPagina(index + 1)}>
                        {index+1} 
                      </button>
                    ))}



    <div className='d-flex justify-content-center m-5 flex-column align-items-center'>
      <div className='d-flex'>
          <h3 className='mx-2 my-2 px-4 opacity-50 btn pe-auto btn-outline-success fs-3' onClick={handlePrev}>{'<'}Anterior  </h3>
              <div className='d-flex justify-content-center my-4'>
      {Array.from({length:totalPaginas}, (_, index) => (
        <button key= {index + 1} className={`btn mx-1 ${numeroPaginaActual === index + 1 ? "btn-primary" : "btn-outline-primary"}`} onClick={()=>cambiarPagina(index + 1)}>
          {index+1}    
     
        </button>
      ))}
    </div>    
          <h4 className='mx-2 my-2 px-4 pe-auto fs-3 btn btn-outline-success' >{numeroPaginaActual}</h4>
          <h3 className='mx-2 my-2 px-4 opacity-50 btn pe-auto btn-outline-success fs-3' onClick={handleNext}>Siguiente{'>'} </h3>
      </div>
        
      <p className='mx-5 my-2 px-4 btn pe-auto opacity-50 fs-5'>Total {totalproducts} Productos  Página {numeroPaginaActual} de {totalPaginas} </p>
        
    </div>




        <div className='d-flex justify-content-center my-4'>
      {Array.from({length:totalPaginas}, (_, index) => (
        <button key= {index + 1} className={`btn mx-1 ${numeroPaginaActual === index + 1 ? "btn-primary" : "btn-outline-primary"}`} onClick={()=>cambiarPagina(index + 1)}>
          {index+1}    
     
        </button>
      ))}
    </div>    
  */}