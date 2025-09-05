import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email !== 'admin@kalamkar.art') {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    }
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
    <style jsx>{`
      /* Same styles as before */
      .admin-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background-color: var(--color-black); color: var(--color-dark-grey); }
      .admin-nav { display: flex; gap: 1.5rem; align-items: center; }
      .admin-nav a { color: var(--color-dark-grey); text-decoration: none; font-weight: bold; }
      .admin-nav a:hover { color: var(--color-secondary); }
      .right-section { display: flex; align-items: center; gap: 1.5rem; }
      .logout-btn { background-color: var(--color-primary); color: var(--color-dark-grey); border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; }
    `}</style>
    <div>
        <header className="admin-header">
            <div className="admin-nav">
                <h2>Kalamkar Admin</h2>
                <Link href="/admin/products">Products</Link>
                <Link href="/admin/orders">Orders</Link>
                <Link href="/admin/settings">Settings</Link>
                {/* --- THIS IS THE NEW LINK --- */}
                <Link href="/admin/notifications">Notifications</Link>
            </div>
            <div className="right-section">
              <span>{user.email}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </header>
        <main>
            {children}
        </main>
    </div>
    </>
  );
}