"use client"
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold text-blue-600">
              MedVice
            </Link>
          </div>
          <div className="text-gray-600 text-sm">
            © 2025 MedVice. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
