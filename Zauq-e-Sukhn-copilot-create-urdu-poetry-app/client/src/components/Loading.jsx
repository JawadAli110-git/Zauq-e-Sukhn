const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
        <div className="w-10 h-10 border-4 border-yellow-100 border-t-yellow-400 rounded-full animate-spin absolute top-3 left-3" style={{ animationDirection: 'reverse' }}></div>
      </div>
      <p className="mt-6 text-xl text-accent" style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: 'rtl' }}>
        لوڈ ہو رہا ہے...
      </p>
    </div>
  );
};

export default Loading;
