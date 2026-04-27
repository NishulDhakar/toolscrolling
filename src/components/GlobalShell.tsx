'use client';

import React, { useState, useEffect } from 'react';
import CmdKModal from './CmdKModal';

export default function GlobalShell({ children }: { children: React.ReactNode }) {
  const [cmdKOpen, setCmdKOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdKOpen(true);
      }
    };
    const onEvent = () => setCmdKOpen(true);

    window.addEventListener('keydown', onKey);
    window.addEventListener('open-cmdk', onEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-cmdk', onEvent);
    };
  }, []);

  return (
    <>
      {children}
      {cmdKOpen && <CmdKModal onClose={() => setCmdKOpen(false)} />}
    </>
  );
}
