import React from 'react';
import { createRoot } from 'react-dom/client';
import TestC from './TestC';

const root = createRoot(document.getElementById('root'));

root.render(
  <>
    <h1>Hello world</h1>
    <TestC />
  </>,
);
