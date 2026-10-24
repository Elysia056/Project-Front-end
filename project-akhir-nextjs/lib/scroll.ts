import type { MouseEvent } from "react";

// Smooth scroll ke section (dikurangi tinggi header 70px)
export function scrollKeSection(
  e: MouseEvent<HTMLAnchorElement>,
  href: string
): boolean {
  const targetSection = document.querySelector(href);
  if (!targetSection) return false;

  e.preventDefault();
  const headerHeight = 70;
  const targetPosition =
    targetSection.getBoundingClientRect().top +
    window.pageYOffset -
    headerHeight;

  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  });
  return true;
}