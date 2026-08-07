import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout — Bố cục chung: Header + Content + Footer
 * Content có padding-top 72px (chiều cao header)
 */
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 lg:pt-[68px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
