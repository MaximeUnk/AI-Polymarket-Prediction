# 🔮 Crystal Poly - See the Future! 🔮

A sophisticated prediction interface for making forecasts on events. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## 📈 What is this?

This is a modern prediction interface where users can:
- 🔗 Input event links
- 🔮 Get AI-powered predictions 
- 📊 See results in a beautiful, animated interface
- 💰 View potential returns and confidence levels

## 🚀 Features

- **Modern Design**: Sleek colors, animations, and professional UI elements
- **Responsive Design**: Works on desktop and mobile devices  
- **Interactive Predictions**: Enter any event link and get mock predictions
- **Real-time Feedback**: Loading states and toast notifications
- **Beautiful Components**: Using shadcn/ui for polished UI components

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide Icons** - Icon library

## 🏗️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd crystal-poly
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 How to Use

1. **Enter Event Link**: Paste any event URL in the input field
2. **Click Analyze**: Hit the big "ANALYZE & PREDICT!" button
3. **Wait for Analysis**: Watch the loading animation (2 second demo delay)
4. **View Results**: See your prediction with:
   - 🎯 Probability percentage
   - 📊 Confidence level
   - 💰 Potential return multiplier
   - 📂 Event category
5. **Try Again**: Reset and make another prediction!

## 🎨 Design Features

- **Animated Background**: Floating, animated circles for ambiance
- **Gradient Text**: Eye-catching rainbow gradient titles
- **Professional Colors**: Gold, purple, and neon color scheme
- **Hover Effects**: Buttons scale and change on hover
- **Loading States**: Spinning indicators and progress bars
- **Toast Notifications**: Informative prediction messages

## 🔧 Customization

### Adding Real API Integration

Currently, the app uses mock data. To connect to a real prediction API:

1. Replace the `setTimeout` in `handlePredict` function
2. Add your API endpoint in `/src/components/PredictionInterface.tsx`
3. Update the prediction data structure as needed

### Styling Changes

- Modify colors in `tailwind.config.ts`
- Update component styles in `/src/components/PredictionInterface.tsx`
- Add new animations or effects using Tailwind classes

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Toaster
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   └── PredictionInterface.tsx # Main prediction interface
├── hooks/
│   └── use-toast.ts       # Toast notification hook
└── lib/
    └── utils.ts           # Utility functions
```

## 🎯 Next Steps

For a production version, consider adding:

- 🔐 User authentication
- 💾 Database integration
- 🤖 Real AI prediction API
- 📊 Prediction history
- 🏆 Leaderboards
- 💳 Payment integration
- 📱 PWA capabilities

## 📊 Trade Responsibly!

Remember: This is for informational purposes. Always make informed trading decisions! 📈

---

Built with ❤️ using [shadcn/ui](https://ui.shadcn.com/) and Next.js
