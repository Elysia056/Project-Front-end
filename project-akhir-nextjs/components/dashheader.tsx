"use client";

interface DashHeaderProps {
  children?: React.ReactNode;
}

function DashHeader({ children }: DashHeaderProps) {
  return (
    <header className="dash-header">
      <div className="container">
        <a href="/" className="dash-logo">
          Bika Ambon
          <span>Kelompok 1</span>
        </a>
        {children}
      </div>
    </header>
  );
}

export default DashHeader;