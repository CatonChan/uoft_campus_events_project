import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Redirect to discover page
    navigate("/discover");
  }, [navigate]);

  return null;
}
