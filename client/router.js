import Login from './js/login/LoginView'
import Home from './js/home/HomeView'

//var Router = ReactRouterDOM.BrowserRouter;
var Router = ReactRouterDOM.HashRouter;
var Route = ReactRouterDOM.Route;
var Link = ReactRouterDOM.Link;
const Main = () => (
  <Router>
    <div>
      <Route exact path="/" component={Login}/>
      <Route path="/home" component={Home}/>
      <Route path="/login" component={Login}/>
    </div>
  </Router>
)
export default Main