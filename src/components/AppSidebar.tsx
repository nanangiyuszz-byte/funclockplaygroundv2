import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, BookOpen, Brain, History, X, Home, LogOut } from 'lucide-react';

type Page = 'home' | 'learning' | 'quiz' | 'progress';

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: '🏠 Home (Clock)', icon: Home },
  { id: 'learning', label: '📚 Learning Hub', icon: BookOpen },
  { id: 'quiz', label: '🧠 Quiz', icon: Brain },
  { id: 'progress', label: '📊 Progress History', icon: History },
];

const AppSidebar: React.FC<AppSidebarProps> = ({ open, onClose, currentPage, onNavigate }) => {
  
  // Fungsi untuk Logout
  const handleLogout = () => {
    if (confirm("Apakah kamu yakin ingin keluar? Sesi nama kamu akan dihapus.")) {
      localStorage.removeItem('user-name');
      window.location.reload(); // Memaksa halaman refresh untuk kembali ke input nama
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-40" onClick={onClose} />
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-sidebar z-50 shadow-2xl flex flex-col">
            
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <h2 className="text-lg font-bold text-sidebar-foreground">📖 Menu</h2>
              <button onClick={onClose} className="text-sidebar-foreground hover:text-sidebar-primary">
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1">
              {navItems.map(item => (
                <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-colors flex items-center gap-3
                    ${currentPage === item.id ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}`}>
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* BAGIAN BAWAH (Area Merah) */}
            <div className="p-4 border-t border-sidebar-border space-y-4">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
              >
                <LogOut size={20} />
                Keluar / Logout
              </button>

              <div className="text-[10px] text-sidebar-foreground/60">
                <p className="font-bold uppercase tracking-widest">analogstudywebb2</p>
                <p>© 2026 • analogClok</p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default AppSidebar;
