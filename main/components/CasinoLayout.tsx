import React from 'react';
import { Search, User, Bell, MessageCircle } from 'lucide-react';

interface CasinoLayoutProps {
  children: React.ReactNode;
}

export default function CasinoLayout({ children }: CasinoLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
            <span className="text-xl font-bold">POLYMARKET</span>
            <span className="text-muted-foreground">PREDICTIONS</span>
          </div>
          
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-primary font-medium border-b-2 border-primary pb-1">HOME</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">MARKETS</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">TRENDING</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">REWARDS</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div className="flex items-center space-x-2 bg-secondary px-3 py-2 rounded-lg">
              <span className="text-yellow-400 font-bold">985.85</span>
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 sidebar-gradient border-r border-border min-h-screen">
          {/* VIP Perks Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">MY VIP PERKS</h3>
              <a href="#" className="text-sm text-primary">View All</a>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold">BC</span>
                </div>
                <div>
                  <div className="text-sm font-medium">BONUSCODE</div>
                  <div className="text-xs text-muted-foreground">Unlocked</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold">RB</span>
                </div>
                <div>
                  <div className="text-sm font-medium">RAKEBACK</div>
                  <div className="text-xs text-muted-foreground">VIP · Lvl 0</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="px-4 pb-4">
            <div className="text-xs text-muted-foreground mb-2">Menu</div>
            
            <div className="space-y-1">
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary">
                <span>🎰</span>
                <span>Live Casino</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary">
                <span>🎯</span>
                <span>Predictions</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary">
                <span>🔥</span>
                <span>Hot Markets</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary">
                <span>📈</span>
                <span>Trending</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary">
                <span>🎲</span>
                <span>Roulette</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary">
                <span>⚡</span>
                <span>High Volatility</span>
              </a>
            </div>
          </nav>

          {/* Picks For You */}
          <div className="px-4">
            <div className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary">
              <span>🎯</span>
              <span>Picks For You</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary">
              <span>⭐</span>
              <span>Favourites</span>
            </div>
          </div>

          {/* Language Selector */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center space-x-2 text-sm">
              <span>🌐</span>
              <span>English</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Chat Sidebar */}
        <aside className="w-80 bg-card border-l border-border">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Community Chat</h3>
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          
          <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                  A
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Alexei Berezin</span>
                    <span className="text-xs text-muted-foreground">
                      {String(5 + i).padStart(2, '0')}:{String(15 + i).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {i % 3 === 0 && "It uses a dictionary of over 200 Latin words"}
                    {i % 3 === 1 && "There are many variations of passages of Lorem Ipsum"}
                    {i % 3 === 2 && "Contrary to popular belief, Lorem Ipsum is not simply random text"}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type Message"
                className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
} 