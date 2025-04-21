import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-gradient-to-br from-pink-100 to-blue-100 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-3xl font-bold text-gray-900">
            🧠 QuizMe
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <SignedIn>
              <Link href="/me" className="text-gray-900 hover:text-blue-600">
                My Profile
              </Link>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-blue-600">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
}