import GestureRecognition from '@/components/GestureRecognition';

export default function Home() {
  return (
    <main>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Welcome to gesLang, a language for all.
            </p>
            <button className="btn btn-primary">Get Started</button>
            <GestureRecognition />
          </div>
        </div>
      </div>
    </main>
  );
}