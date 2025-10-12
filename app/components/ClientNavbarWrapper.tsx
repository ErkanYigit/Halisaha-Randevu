"use client";
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';

export default function ClientNavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = pathname === '/auth/login' || pathname === '/admin/login';
  if (hideNavbar) return null;
  return <Navbar />;
} 