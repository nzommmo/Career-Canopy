// Main.jsx - Dark Theme Layout
import Header from "./Header";

export default function Main({ children }) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}