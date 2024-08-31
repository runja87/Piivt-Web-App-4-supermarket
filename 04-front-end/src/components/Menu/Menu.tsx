import { Link } from "react-router-dom";
export default function Menu(){
    return(
   
<nav className="navbar navbar-expand-lg bg-body-tertiary mb-4">
  <div className="container-fluid">
    <Link className="navbar-brand" to="#">Menu</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link " aria-current="page" to="/">Home </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/message">Contact us</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/auth/administrator/login">Admin login</Link>
        </li>
        <li className="nav-item dropdown">
          <Link className="nav-link dropdown-toggle" to="/category" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Categories
          </Link>
          <ul className="dropdown-menu">
            <li><Link className="dropdown-item" to="/product">Product</Link></li>
            <li><Link className="dropdown-item" to="/news">News</Link></li>
            <li><hr className="dropdown-divider"/></li>
            <li><Link className="dropdown-item" to="#">Something else here</Link></li>
          </ul>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/dashboard">Admin dasboard</Link>
        </li>
      </ul>
      <form className="d-flex" role="search">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>

    
    );
}