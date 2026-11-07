"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Subsidiary = "AFG" | "SGABS";

interface SubsidiaryContextType {
  subsidiary: Subsidiary;
  setSubsidiary: (sub: Subsidiary) => void;
  isAFG: boolean;
  isSGABS: boolean;
}

const STORAGE_KEY = "payway_active_subsidiary";

const SubsidiaryContext = createContext<SubsidiaryContextType>({
  subsidiary: "AFG",
  setSubsidiary: () => {},
  isAFG: true,
  isSGABS: false,
});

export function SubsidiaryProvider({ children }: { children: React.ReactNode }) {
  // Par défaut AFG (conformément à la demande utilisateur)
  const [subsidiary, setSubsidiaryState] = useState<Subsidiary>("AFG");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "AFG" || stored === "SGABS") {
        setSubsidiaryState(stored);
      } else {
        localStorage.setItem(STORAGE_KEY, "AFG");
      }
    } catch {
      // Ignore si pas de localStorage dispo
    }
    setMounted(true);
  }, []);

  const setSubsidiary = (sub: Subsidiary) => {
    setSubsidiaryState(sub);
    try {
      localStorage.setItem(STORAGE_KEY, sub);
    } catch {}
  };

  const isAFG = subsidiary === "AFG";
  const isSGABS = subsidiary === "SGABS";

  return (
    <SubsidiaryContext.Provider value={{ subsidiary, setSubsidiary, isAFG, isSGABS }}>
      {children}
    </SubsidiaryContext.Provider>
  );
}

export function useSubsidiary() {
  return useContext(SubsidiaryContext);
}

