import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <nav className="bg-blue-700 text-white shadow-xl sticky top-0 z-50 border-b border-white/10 font-black uppercase">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <Link href="/" className="text-2xl md:text-3xl tracking-tighter hover:text-yellow-400 transition-all duration-300">
            PARK<span className="text-yellow-400">ZONE</span>
          </Link>
          
          <div className="hidden md:flex space-x-6 text-[12px] tracking-[0.2em]">
            <Link href="/" className="hover:text-yellow-400 hover:scale-105 transition-all">Ballina</Link>
            
            {isAdmin ? (
                <>
                    <Link href="/admin" className="text-yellow-400 hover:text-white transition-all italic underline decoration-2 underline-offset-8">Admin Hub</Link>
                </>
            ) : (
                session && (
                    <>
                        <Link href="/products" className="hover:text-yellow-400 transition-all">Lokacionet</Link>
                        <Link href="/vehicles" className="hover:text-yellow-400 transition-all">Veturat</Link>
                        <Link href="/dashboard" className="hover:text-yellow-400 transition-all">Rezervimet</Link>
                        <Link href="/favorites" className="text-red-400 hover:text-white transition-all">❤️ Favoritët</Link>
                    </>
                )
            )}

            <Link href="/faq" className="hover:text-yellow-400 transition-all">FAQ</Link>
            {!isAdmin && <Link href="/contact" className="hover:text-yellow-400 transition-all">Kontakti</Link>}
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-3 bg-blue-800 p-1 rounded-full pr-4 border border-white/10 shadow-inner">
                <Link href="/profile" className="flex items-center space-x-2 group">
                  {session.user.image ? (
                    <img src={session.user.image} className="w-9 h-9 rounded-full object-cover border-2 border-yellow-400 group-hover:rotate-6 transition-all" alt="P" />
                  ) : (
                    <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-blue-900 text-xs group-hover:scale-110 transition-all">{session.user.name.charAt(0)}</div>
                  )}
                  <span className="text-[10px] tracking-widest hidden lg:block italic group-hover:text-yellow-400">Profili</span>
                </Link>
                <div className="w-[1px] h-4 bg-white/20"></div>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="text-[10px] tracking-widest text-red-400 hover:text-red-300 hover:scale-105 transition-all">Logout</button>
              </div>
            ) : (
              <Link href="/login" className="bg-white text-blue-700 px-6 py-2.5 rounded-full text-xs hover:bg-yellow-400 hover:text-blue-900 transition-all shadow-lg">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;