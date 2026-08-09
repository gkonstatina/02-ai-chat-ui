interface Props {
  onClear: () => void;
}

function Header({ onClear }: Props) { 
  return (
    <header className="bg-slate-800 text-white p-4 shadow-md">
      <h1 className="text-2xl font-bold text-center">
        🤖 AI Chat
      </h1>
      <button
        onClick={onClear}
        className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white"
      >
        New Chat
      </button>
    </header>    
  );
}

export default Header;