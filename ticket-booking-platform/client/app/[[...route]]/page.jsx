"use client";

import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import App from "../../src/App.jsx";

export default function CatchAllPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
