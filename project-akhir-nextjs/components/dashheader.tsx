"use client";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

interface DashHeaderProps {
  children?: React.ReactNode;
}

function DashHeader({ children }: DashHeaderProps) {
  return (
    <Navbar variant="dark" className="navbar-dash py-3">
      <Container className="flex-wrap gap-2">
        <Navbar.Brand href="/" className="dash-logo-text">
          Bika Ambon
          <small>Kelompok 1</small>
        </Navbar.Brand>
        {children}
      </Container>
    </Navbar>
  );
}

export default DashHeader;