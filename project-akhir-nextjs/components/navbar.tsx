"use client";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Akun, ambilUserLogin } from "@/lib/auth";
import { scrollKeSection } from "@/lib/scroll";
import type { KontenNavbar } from "@/lib/konten";

interface NavbarProps {
  aktif: string;
  data: KontenNavbar;
}

function NavigationBar({ aktif, data }: NavbarProps) {
  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [user, setUser] = useState<Akun | null>(null);

  // Tombol auth di navbar (MASUK atau nama user)
  useEffect(() => {
    setUser(ambilUserLogin());
  }, []);

  const handleKlik = (e: React.MouseEvent<HTMLElement>, href: string) => {
    if (scrollKeSection(e as React.MouseEvent<HTMLAnchorElement>, href)) {
      setMenuTerbuka(false);
    }
  };

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="navbar-bika py-2"
      expanded={menuTerbuka}
      onToggle={(terbuka) => setMenuTerbuka(terbuka)}
    >
      <Container>
        <Navbar.Brand href="#beranda" className="logo-area">
          <div className="logo-badge"></div>
          <div className="logo-text">
            <h1>{data.brand}</h1>
            <span className="tagline">{data.tagline}</span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarUtama" />
        <Navbar.Collapse id="navbarUtama" className="justify-content-end">
          <Nav className="align-items-lg-center gap-lg-2">
            {data.menu.map((menu) => (
              <Nav.Link
                key={menu.id}
                href={"#" + menu.id}
                active={aktif === menu.id}
                onClick={(e) => handleKlik(e, "#" + menu.id)}
              >
                {menu.label}
              </Nav.Link>
            ))}
            {user ? (
              <Nav.Link
                href={user.role === "admin" ? "/admin" : "/user"}
                className="nav-user-badge"
                title="Buka Dashboard"
              >
                <span className="nav-user-name">{user.username}</span>
              </Nav.Link>
            ) : (
              <Nav.Link href="/login">{data.labelMasuk}</Nav.Link>
            )}
            <Button
              href="#pesan"
              variant="dark"
              size="sm"
              className="ms-lg-2 mt-2 mt-lg-0 px-3"
              onClick={(e) => handleKlik(e, "#pesan")}
            >
              {data.tombolPesan}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
