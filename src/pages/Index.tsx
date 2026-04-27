import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import ClockPlayground from '@/components/ClockPlayground';
import QuizSystem from '@/components/QuizSystem';
import LearningHub from '@/components/LearningHub';
import ProgressHistory from '@/components/ProgressHistory';

type Page = 'home' | 'learning' | 'quiz' | 'progress';

const Index: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState<Page>('home');

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Sidebar - Sekarang memegang kendali fitur Logout */}
      <AppSidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        currentPage={page} 
        onNavigate={setPage} 
      />

      {/* Header Section */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 rounded-xl hover:bg-muted transition"
          >
            <Menu size={24} className="text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: '#9D64FA' }}>
              Fun Clock Playground
            </h1>
            <div className="flex flex-col mt-0.5">
              <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-tight">
                Oleh: <span className="text-purple-600">Ladyus Azalea M. S.</span> (Dyzz_SMPN 31 SBY)
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-tight">
                Tim: <span className="text-blue-500">Hanifah Dinny A.</span> (Nifzz_SMPN 31 SBY)
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 pb-12 pt-4">
        <motion.div 
          key={page} 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
        >
          {page === 'home' && <ClockPlayground onStartQuiz={() => setPage('quiz')} />}
          {page === 'quiz' && <QuizSystem onBack={() => setPage('home')} />}
          {page === 'learning' && <LearningHub />}
          {page === 'progress' && <ProgressHistory />}
        </motion.div>
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-border py-6 px-4 text-center space-y-1">
        <p className="text-xs sm:text-sm text-muted-foreground">
          © 2026 analogstudywebb2
        </p>
      </footer>
    </div>
  );
};

export default Index;
