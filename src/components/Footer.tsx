export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-pink-100 to-blue-100 text-gray-700 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
          <p className="text-sm font-semibold">Made in <a href="https://sundai.club" className="text-blue-600 hover:underline">sundai.club</a></p>
        </div>
      </div>
    </footer>
  );
} 