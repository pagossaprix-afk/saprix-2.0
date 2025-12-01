"use client";

import { useEffect, useState } from "react";
import HeaderMobile from "@/components/layout/HeaderMobile";

export default function HeaderMobileClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <HeaderMobile />;
}

