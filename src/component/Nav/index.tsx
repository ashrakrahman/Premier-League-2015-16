import React from "react";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav } from "reactstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import OperatorList from "../OperatorList";

interface NavProps {}

interface NavBarState {
  isOpen: boolean;
}

class NavBar extends React.Component<NavProps, NavBarState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  public componentDidMount() {}

  render() {
    return (
      <Router>
        <Navbar
          color="dark"
          dark
          className="justify-content-between"
          expand="md"
        >
          <NavbarBrand href="/premier-league-test">
            Premier League 2015-16
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar></Nav>
          </Collapse>
        </Navbar>
        <Switch>
          {/* Forward Public Routes to the Home Page */}
          <Route exact path="/premier-league-test" component={OperatorList} />
        </Switch>
      </Router>
    );
  }
}

export default NavBar;
