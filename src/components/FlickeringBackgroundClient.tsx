"use client"; // Marca este como um Client Component

import React from 'react';
import dynamic from 'next/dynamic';

// Importa dinamicamente o FlickeringGrid aqui, apenas no cliente
const DynamicFlickeringGrid = dynamic(
  () => import('@/components/magicui/flickering-grid').then(mod => mod.FlickeringGrid),
  { ssr: false }
);

const FlickeringBackgroundClient = () => {
  // Renderiza o componente dinâmico, passando uma cor clara
  return <DynamicFlickeringGrid color="rgb(200, 200, 200)" className="fixed inset-0 z-[-1]" />;
};

export default FlickeringBackgroundClient; 