import AdministratorRouter from './components/administrator/AdministratorRouter.router';
import AuthRouter from './components/auth/AuthRouter.router';
import CategoryRouter from './components/category/CategoryRouter.router';
import ContactRouter from './components/contact/ContactRouter.router';
import PageRouter from './components/page/PageRouter.router';

const AplicationRouters = [
    new CategoryRouter(),
    new AdministratorRouter(),
    new PageRouter(),
    new ContactRouter(),
    new AuthRouter(),
];
export default AplicationRouters;