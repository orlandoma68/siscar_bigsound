import React from 'react'
import banner1 from "../imagen/banner1.png"
import banner2 from "../imagen/banner2.png"
import banner4 from "../imagen/banner4.png"
import { Link } from 'react-router-dom'

const Carrusel = () => {

  return (
    <div className='container my-3'>
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner rounded-3" style={{ overflow: 'hidden' }}>
          <div className="carousel-item active" data-bs-interval="4000">
            <Link to="/auth/register">
              <img src={banner1} alt="banner-1" className="d-block w-100" style={{ height: '400px', objectFit: 'cover' }} />
            </Link>
          </div>
          <div className="carousel-item" data-bs-interval="4000">
            <Link to="/auth/register">
              <img src={banner2} alt="banner-2" className="d-block w-100" style={{ height: '400px', objectFit: 'cover' }} />
            </Link>
          </div>
          <div className="carousel-item" data-bs-interval="4000">
            <Link to="/auth/register">
              <img src={banner4} alt="banner-3" className="d-block w-100" style={{ height: '400px', objectFit: 'cover' }} />
            </Link>
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>

        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </div>
  )
}

export default Carrusel
