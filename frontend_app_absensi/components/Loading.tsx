
export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex space-x-2">
        <span className="w-2 h-2 bg-brand-700 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-brand-700 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-brand-700 rounded-full animate-bounce" />
      </div>
    </div>
  );
}