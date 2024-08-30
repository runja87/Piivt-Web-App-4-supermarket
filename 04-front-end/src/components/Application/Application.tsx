import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Application.sass';
import { Container } from 'react-bootstrap';
import LoginPage from '../Administrator/LoginPage/LoginPage';
import { Route, Routes } from 'react-router-dom';
import Messages from '../Pages/Messages/Messages';
import Menu from '../Menu/Menu';
import UserCategoryList from '../User/UserCategoryList/UserCategoryList';
import UserCategoryPage from '../User/UserCategoryPage/UserCategoryPage';
import AdminDashboard from '../Administrator/Dashboard/AdminDashboard';
import AdminCategoryList from '../Administrator/Dashboard/AdminCategoryList';
import AdminCategoryProductList from '../Administrator/Dashboard/AdminCategoryProductList';
import AdminAdministratorList from '../Administrator/Dashboard/AdminAdministratorList';
import AdminAdministratorAdd from '../Administrator/Dashboard/AdminAdministratorAdd';
import AdminCategoryNewsList from '../Administrator/Dashboard/AdminCategoryNewsList';



function Application() {
  return (
    <Container className='mt-4'>
     <Menu/>
     
      <Routes>
  <Route path='/category/:id' element={ <UserCategoryPage/> }/>
  <Route path='/category' element={ <UserCategoryList/> }/>
  <Route path='/message' element={ <Messages/>}/>
  <Route path='/auth/administrator/login' element={ <LoginPage/>}/>
  <Route path='/' element={ <div></div>}/>

  <Route path='/admin/dashboard' element={ <AdminDashboard/> } />
  <Route path='/admin/dashboard/category/list' element={ <AdminCategoryList/> } />
  <Route path='/admin/dashboard/category/:cid/product/list' element={ <AdminCategoryProductList/> } />
  <Route path='/admin/dashboard/category/:cid/news/list' element={ <AdminCategoryNewsList/> } />
  <Route path='/admin/dashboard/administrator/list' element={ <AdminAdministratorList/> } />
  <Route path='/admin/dashboard/administrator/add' element={ <AdminAdministratorAdd/> } />
  <Route path='/admin/dashboard/category/:cid/product/list"' element={ <p>NIje rutirano</p>} />
  
</Routes>


  

    </Container>
  );
}

export default Application;