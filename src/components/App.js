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
import Preferences from "./Preferences";
import Home from "./Home";
import AddRestaurant from "./AddRestaurant";

function App() {
  return (
    <>
      <AuthProvider>
        <NavBar />
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "70vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <Router>
              <Switch>
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute
                  exact
                  path="/add-restaurants"
                  component={AddRestaurant}
                />
                <PrivateRoute
                  path="/update-profile"
                  component={UpdateProfile}
                />
                <PrivateRoute path="/prefernces" component={Preferences} />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <Route path="/dashboard" component={Dashboard} />
              </Switch>
            </Router>
          </div>
        </Container>
      </AuthProvider>
    </>
  );
}

export default App;
