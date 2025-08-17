import React from 'react';
import { Metadata } from 'next';
import { AtlasHelper } from '@/components/database/atlas-helper';

export const metadata: Metadata = {
  title: 'MongoDB Atlas Helper - NGFW Dashboard',
  description: 'Find your MongoDB Atlas cluster name and database name',
};

export default function AtlasHelperPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AtlasHelper />
      </div>
    </div>
  );
}
