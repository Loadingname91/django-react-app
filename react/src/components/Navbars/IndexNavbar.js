import React from "react";
import AuthService from '../../components/AuthService';

import { Link  } from 'react-router-dom';
// nodejs library that concatenates strings
import classnames from "classnames";
// reactstrap components
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container
} from "reactstrap";


// styles
import "../../assets/css/bootstrap.min.css";
import "../../assets/scss/paper-kit.scss";
import "../../assets/demo/demo.css";





function IndexNavbar() {
  const [navbarColor, setNavbarColor] = React.useState("navbar-transparent");
  const [navbarCollapse, setNavbarCollapse] = React.useState(false);
  const auth = new AuthService()
  const userinfo = sessionStorage.getItem("userprofile")
  console.log(userinfo)

  const toggleNavbarCollapse = () => {
    setNavbarCollapse(!navbarCollapse);
    document.documentElement.classList.toggle("nav-open");
  };


  const handlelogout = () =>{
    auth.logout()
    console.log("lOGEEEEEED OUT")
    window.alert("sucessfully logged out")
    window.location.reload()
  }

  React.useEffect(() => {
    const updateNavbarColor = () => {
      if (
        document.documentElement.scrollTop > 299 ||
        document.body.scrollTop > 299
      ) {
        setNavbarColor("");
      } else if (
        document.documentElement.scrollTop < 300 ||
        document.body.scrollTop < 300
      ) {
        setNavbarColor("navbar-transparent");
      }
    };

    window.addEventListener("scroll", updateNavbarColor);

    return function cleanup() {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  });

  const json_user = JSON.parse(userinfo)

  
  return (
    <Navbar className={classnames("fixed-top", navbarColor)} expand="lg" >
      <Container>
        <div className="navbar-translate">
          <NavbarBrand
            data-placement="bottom"
            as = {Link}
            href="/"
            // open in new tab target="_blank"
            title="Coded by people at PESITM CSE"
          >
            PESITM CSE
          </NavbarBrand>
          <button
            aria-expanded={navbarCollapse}
            className={classnames("navbar-toggler navbar-toggler", {
              toggled: navbarCollapse
            })}
            onClick={toggleNavbarCollapse}
          >
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
          </button>
        </div>
        <Collapse
          className="justify-content-end"
          navbar
          isOpen={navbarCollapse}
        >
          <Nav navbar>
            
            <NavItem>
              <NavLink
                data-placement="top"
                href="https://www.freecodecamp.org"
                target="_blank"
                title="Learn for free"
              >
                <p>Free Code Camp</p>
              </NavLink>
            </NavItem>
           
        
         
            <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle
                        aria-expanded={false}
                        aria-haspopup={true}
                        caret
                        color="default"
                        data-toggle="dropdown"
                        href="#pablo"
                        id="dropdownMenuButton"
                        nav
                        role="button"
                      >
                        Menu
                      </DropdownToggle>
                      <DropdownMenu
                        aria-labelledby="dropdownMenuButton"
                        className="dropdown-info"
                      >
                        <DropdownItem
                          as = {Link}
                          href="/userprofile"
                        >
                          Profile
                        </DropdownItem>
                        
                        <DropdownItem divider />      

                        { json_user ? (json_user.is_staff ? 
                            <>
                            <DropdownItem divider />
                              <DropdownItem
                              as = {Link}
                              href="/testroute"
                            >
                              results for admins
                            </DropdownItem>
                            </>
                             :"") : ""} 

                        <DropdownItem divider />
                        <DropdownItem
                          
                          onClick = {handlelogout}
                         
                        >
                         
                          Log out
                        </DropdownItem>
                        
                  
                        

                        
                       

                      </DropdownMenu>
                    </UncontrolledDropdown>
          
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default IndexNavbar;
