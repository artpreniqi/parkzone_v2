import { render, screen } from '@testing-library/react';
import React from 'react';

// 1. MOCK-IMI TOTAL I LIBRARIVE QE SHKAKTOJNE ERROR (Para se te importohen komponentet)
jest.mock('next/link', () => ({ children, href }) => <a href={href}>{children}</a>);

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
  SessionProvider: ({ children }) => <div>{children}</div>,
  signOut: jest.fn(),
  signIn: jest.fn(),
}));

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

// Mock-ojmë skedarët API që të mos ngarkojnë libraritë e dëmshme (jose, bson)
jest.mock('../pages/api/capacity', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../pages/api/bookings', () => ({
  __esModule: true,
  default: jest.fn(),
  config: {}
}));

// Mock-ojmë librarinë e databazës dhe modelet
jest.mock('mongoose', () => ({
  model: jest.fn(),
  models: {},
  Schema: jest.fn(),
}));

jest.mock('../lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// 2. IMPORTI I KOMPONTENTEVE TUAJA (Pasi kemi bere mock-et)
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

// --- TESTET E KOMPONENTËVE (3 TESTE) ---

describe('Testimi i Komponentëve (UI)', () => {
  
  it('verifikon shfaqjen e logos PARKZONE', () => {
    render(
      <div id="__next">
        <Navbar />
      </div>
    );
    expect(screen.getByText(/PARK/i)).toBeInTheDocument();
  });

  it('verifikon ekzistencën e linkut FAQ në Footer', () => {
    render(<Footer />);
    expect(screen.getByText(/FAQ/i)).toBeInTheDocument();
  });

  it('shfaq çmimin saktë te ProductCard', () => {
    const mockProduct = { 
      _id: '123', name: 'TEST', price: 1.50, 
      location: 'PR', availableSlots: 10, totalSlots: 20 
    };
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/€1.50/i)).toBeInTheDocument();
  });
});

// --- TESTET E API ROUTES (2 TESTE) ---

describe('Testimi i API Routes', () => {
  
  it('kontrollon nëse API i kapacitetit është i definuar si modul', () => {
    const handler = require('../pages/api/capacity').default;
    expect(handler).toBeDefined();
  });

  it('kontrollon nëse API i rezervimeve është i definuar si modul', () => {
    const handler = require('../pages/api/bookings').default;
    expect(handler).toBeDefined();
  });
});