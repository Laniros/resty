import Signup from "./Signup";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { Container } from "react-bootstrap";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import NavBar from "../menus/Navbar";
import Footer from "../menus/Footer";
import Preferences from "./Preferences";
import Home from "./Home";
import AddRestaurant from "./AddRestaurant";
import RequestRestaurant from "./RequestRestaurant";
import EditRestaurant from "./EditRestaurant";

function App() {
  return (
    <>
      <AuthProvider>
        <NavBar />

        <div>
          <Router>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <PrivateRoute
                exact
                path="/add-restaurants"
                component={AddRestaurant}
              />
              <PrivateRoute
                path="/edit-restaurants"
                component={EditRestaurant}
              />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <PrivateRoute
                path="/request-restaurant"
                component={RequestRestaurant}
              />
              <PrivateRoute path="/prefernces" component={Preferences} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/dashboard" component={Dashboard} />
            </Switch>
          </Router>
        </div>

        {/*Think about having a footer */}
      </AuthProvider>
    </>
  );
}

export default App;
