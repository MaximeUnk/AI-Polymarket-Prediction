import React from 'react';
import { ArrowRight, Filter } from 'lucide-react';

export default function CasinoMainContent() {
  return (
    <div className="p-6 space-y-8">
      {/* Promotional Banner */}
      <div className="gradient-promo rounded-xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-sm text-purple-200 mb-2">SIGN UP & GET REWARD</div>
          <h1 className="text-4xl font-bold mb-4">UP TO $ 20,000</h1>
          <p className="text-lg text-purple-100 mb-6 max-w-md">
            Dive into our wide range of prediction markets, live 
            events and trending topics to experience.
          </p>
          <button className="flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
            <span>GET STARTED</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-80">
          <div className="relative">
            {/* Roulette wheel */}
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full border-4 border-white shadow-xl"></div>
            {/* Poker chips */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full border-2 border-white"></div>
            {/* Diamond */}
            <div className="absolute top-8 right-16 w-6 h-6 bg-gradient-to-r from-cyan-300 to-blue-300 transform rotate-45 border border-white"></div>
          </div>
        </div>
      </div>

      {/* Popular Games Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Popular Markets</h2>
        
        <div className="grid grid-cols-4 gap-6">
          {/* Crash Game Card */}
          <div className="gradient-card-crash rounded-xl p-6 text-white card-hover cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold bg-yellow-500 rounded-lg w-12 h-12 flex items-center justify-center text-black">
                999×
              </div>
              <div className="text-right">
                <div className="text-yellow-300">⚡</div>
              </div>
            </div>
            <h3 className="text-xl font-bold">CRASH</h3>
          </div>

          {/* Hash Dice Card */}
          <div className="gradient-card-dice rounded-xl p-6 text-white card-hover cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-1">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded border-2 border-white flex items-center justify-center text-sm font-bold">
                  7
                </div>
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded border-2 border-white flex items-center justify-center text-sm font-bold">
                  7
                </div>
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded border-2 border-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold">HASH DICE</h3>
          </div>

          {/* Keno Card */}
          <div className="gradient-card-keno rounded-xl p-6 text-white card-hover cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 rounded-lg w-12 h-12 flex items-center justify-center">
                <span className="text-2xl font-bold">12</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-6 h-4 bg-white bg-opacity-30 rounded"></div>
                <div className="w-6 h-4 bg-red-500 rounded text-xs flex items-center justify-center font-bold">
                  100%
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold">KENO</h3>
          </div>

          {/* Roulette Card */}
          <div className="gradient-card-roulette rounded-xl p-6 text-white card-hover cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold">ROULETTE</h3>
          </div>
        </div>
      </div>

      {/* Latest Bets & Race Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Predictions & Trends</h2>
          <button className="flex items-center space-x-2 bg-secondary px-4 py-2 rounded-lg hover:bg-secondary/80">
            <Filter className="w-4 h-4" />
            <span>FILTER</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-8 mb-6">
          <button className="text-primary font-medium border-b-2 border-primary pb-2">LATEST BETS</button>
          <button className="text-muted-foreground hover:text-foreground pb-2">HIGH ROLLERS</button>
          <button className="text-muted-foreground hover:text-foreground pb-2">MARKET CONTEST</button>
        </div>

        {/* Bets Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Market</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Player Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Bet Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Multiplier</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Profit Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                { market: 'Election 2024', player: 'Alexei Berezin', amount: '12.90.00', multiplier: '01.98x', profit: '+12,640.00', profitable: true },
                { market: 'Market Crash', player: 'Kristin Watson', amount: '12.90.00', multiplier: '00.55x', profit: '+12,640.00', profitable: true },
                { market: 'Crypto Trends', player: 'Courtney Henry', amount: '12.90.00', multiplier: '00.33x', profit: '-03,630.00', profitable: false },
              ].map((bet, i) => (
                <tr key={i} className="border-t border-border hover:bg-secondary/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-xs font-bold">
                        {bet.market[0]}
                      </div>
                      <span className="font-medium">{bet.market}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {bet.player.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span>{bet.player}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span>💰</span>
                      <span className="font-medium">{bet.amount}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-muted-foreground">{bet.multiplier}</span>
                  </td>
                  <td className="p-4">
                    <span className={`font-medium ${bet.profitable ? 'text-green-400' : 'text-red-400'}`}>
                      {bet.profit}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 