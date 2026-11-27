"use client";
import { useState } from "react";

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = 28,
}: {
  value?: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="d-inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onClick={() => !readOnly && onChange?.(n)}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{
            fontSize: size,
            lineHeight: 1,
            cursor: readOnly ? "default" : "pointer",
            color: n <= (hover || value) ? "#f5b301" : "#ccc",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
