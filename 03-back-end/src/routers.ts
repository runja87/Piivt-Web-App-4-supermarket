import administratorRouter from './components/administrator/AdministratorRouter.router';
import CategoryRouter from './components/category/CategoryRouter.router';
const AplicationRouters = [
    new CategoryRouter(),
    new administratorRouter(),
];
export default AplicationRouters;