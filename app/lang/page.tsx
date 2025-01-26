import GestureRecognition from '@/components/GestureRecognition';
import React from 'react';

const Page: React.FC = () => {
    return (
        <main>
        <div className="hero p-12 bg-base-200 min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <GestureRecognition />
            </div>
          </div>
        </div>
      </main>
    );
};

export default Page;