"use client";
import { useEffect, useState } from "react";
import { Akun, ambilUserLogin } from "@/lib/auth";
import { scrollKeSection } from "@/lib/scroll";

interface NavbarProps {
  aktif: string;
}

const daftarMenu = [
  { id: "beranda", label: "BERANDA" },
  { id: "cerita", label: "CERITA" },
  { id: "keunikan", label: "KEUNIKAN" },
  { id: "galeri", label: "GALERI" },
  { id: "proses", label: "PROSES" },
  { id: "lokasi", label: "LOKASI" },
];

function Navbar({ aktif }: NavbarProps) {
  const [menuAktif, setMenuAktif] = useState(false);
  const [user, setUser] = useState<Akun | null>(null);

  // Render tombol auth di navbar (MASUK atau nama user)
  useEffect(() => {
    setUser(ambilUserLogin());
  }, []);

  const handleKlik = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (scrollKeSection(e, href)) {
      setMenuAktif(false);
    }
  };

  return (
    <header className="main-header" id="header">
      <div className="container header-inner">
        <a href="#beranda" className="logo-area">
          <div className="logo-badge"></div>
          <div className="logo-text">
            <h1>Bika Ambon</h1>
            <span className="tagline">Kelompok 1</span>
          </div>
        </a>

        <nav className={menuAktif ? "main-nav active" : "main-nav"} id="mainNav">
          <ul className="nav-links">
            {daftarMenu.map((menu) => (
              <li className="nav-item" key={menu.id}>
                <a
                  href={"#" + menu.id}
                  className={
                    aktif === menu.id ? "nav-link active" : "nav-link"
                  }
                  onClick={(e) => handleKlik(e, "#" + menu.id)}
                >
                  {menu.label}
                </a>
              </li>
            ))}
            <li className="nav-item" id="navAuthArea">
              {user ? (
                <a
                  href={user.role === "admin" ? "/admin" : "/user"}
                  className="nav-user-badge"
                  title="Buka Dashboard"
                >
                  <span className="nav-user-name">{user.username}</span>
                </a>
              ) : (
                <a href="/login" className="nav-link">
                  MASUK
                </a>
              )}
            </li>
            <li className="nav-item">
              <a
                href="#pesan"
                className="btn-pesan-nav"
                onClick={(e) => handleKlik(e, "#pesan")}
              >
                <span>PESAN</span>
                <span>&rarr;</span>
              </a>
            </li>
          </ul>
        </nav>

        <button
          className="menu-toggle"
          id="menuToggle"
          aria-label="Buka Menu Navigasi"
          type="button"
          onClick={() => setMenuAktif(!menuAktif)}
        >
          &bull;&bull;&bull;
        </button>
      </div>
    </header>
  );
}

export default Navbar;