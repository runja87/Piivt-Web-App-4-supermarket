import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Application.sass';
import { Container } from 'react-bootstrap';

import { Route, Routes } from 'react-router-dom';
import Menu from '../Menu/Menu';

import UserCategoryPage from '../User/Page/UserPageList';
import AdminDashboard from '../Administrator/Dashboard/AdminDashboard';
import AdminCategoryList from '../Administrator/Dashboard/AdminCategoryList';
import AdminCategoryProductList from '../Administrator/Dashboard/AdminCategoryProductList';
import AdminAdministratorList from '../Administrator/Dashboard/AdminAdministratorList';
import AdminAdministratorAdd from '../Administrator/Dashboard/AdminAdministratorAdd';
import AdminCategoryNewsList from '../Administrator/Dashboard/AdminCategoryNewsList';
import AdminContactList from '../Administrator/Dashboard/AdminContactList';
import Messages from '../User/Contact/UserContact';
import AdminPhotoList from '../Administrator/Dashboard/AdminPhotoList';
import AdminPagesList from '../Administrator/Dashboard/AdminPageList';
import UserContactForm from '../User/Contact/UserContact';
import UserNewsList from '../User/News/UserNewsList';
import UserProductsList from '../User/Product/UserProductList';
import UserPagesList from '../User/Page/UserPageList';
import './Application.sass';
import UserHomePageList from '../User/Home/UserHomePageList';
import UserLogin from '../User/Login/UserLogin';
import UserCategoryList from '../Category/UserCategoryList';
import AdminPasswordResetPage from '../Administrator/AdminPasswordResetPage';




function Application() {
  return (
    <Container className='aplication'>
     <Menu/>
     
  <Routes>
  {/* Public Routes */}
  <Route path="/category/:id/product" element={ <UserProductsList/>} />
  <Route path="/category/:id/news" element={ <UserNewsList/>} />
  <Route path='/contact' element={ <UserContactForm/>} />
  <Route path='/pages' element={ <UserPagesList/>} />
  <Route path='/category/:id' element={ <UserCategoryPage/> }/>
  <Route path='/category' element={ <UserCategoryList/> }/>
  <Route path='/message' element={ <Messages/>}/>
  <Route path='/auth/administrator/login' element={ <UserLogin/>}/>
  <Route path='/auth/password-reset' element={ <AdminPasswordResetPage/>}/>
  <Route path='/' element={ <UserHomePageList/> }/>
  {/* Admin Routes */}
  <Route path='/admin/dashboard' element={ <AdminDashboard/> } />
  <Route path='/admin/dashboard/category/list' element={ <AdminCategoryList/> } />
  <Route path='/admin/dashboard/category/:cid/product/list' element={ <AdminCategoryProductList/> } />
  <Route path='/admin/dashboard/category/:cid/news/list' element={ <AdminCategoryNewsList/> } />
  <Route path='/admin/dashboard/administrator/list' element={ <AdminAdministratorList/> } />
  <Route path='/admin/dashboard/administrator/add' element={ <AdminAdministratorAdd/> } />
  <Route path='/admin/dashboard/gallery/list' element={ <AdminPhotoList/>} />
  <Route path='/admin/dashboard/messages/list' element={ <AdminContactList/>} />
  <Route path='/admin/dashboard/pages/list' element={ <AdminPagesList/>} />


</Routes>


  

    </Container>
  );
}

export default Application;