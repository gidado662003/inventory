// pages/404.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-lg">
        Oops! The page you’re looking for is still under construction.
      </p>
      <div className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
        Go Home
      </div>
    </div>
  );
}
