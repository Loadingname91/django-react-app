
import React from "react";

// reactstrap components
import { Row, Container } from "reactstrap";

function DemoFooter() {
  return (
    <footer className="footer footer-black footer-white">
      <Container>
        <Row>
          
          <div className="credits ml-auto">
            <span className="copyright">
              © {new Date().getFullYear()}, made 
              <i className="fa fa-heart heart" /> by guys at PESITM IEEE
            </span>
          </div>
        </Row>
      </Container>
    </footer>
  );
}

export default DemoFooter;
