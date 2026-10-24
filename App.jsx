import { useEffect, useRef, useState } from 'react';
import { AudioLines, ArrowUp, Check, ChevronDown, CircleHelp, Copy, Headphones, Menu, Mic, Pause, Play, Plus, Settings2, Sparkles, Volume2, WandSparkles, X } from 'lucide-react';

const starters = [
  { icon: '✦', title: 'Make it sound natural', text: 'Rewrite this so it sounds more like a real conversation.' },
  { icon: '↗', title: 'Practice a conversation', text: 'Help me practice introducing myself in an interview.' },
  { icon: '◉', title: 'Turn text into speech', text: 'Read a short welcome message in a calm, friendly tone.' },
];

export default function App() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [voice, setVoice] = useState('Calm & clear');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [copied, setCopied] = useState(-1);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => () => { window.speechSynthesis?.cancel(); recognitionRef.current?.stop(); }, []);

  const speak = (value) => {
    if (!('speechSynthesis' in window)) { alert('Speech playback is not supported in this browser. Try Chrome or Edge.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.rate = voice === 'Energetic' ? 1.12 : voice === 'Slow & steady' ? 0.82 : 0.96;
    utterance.pitch = voice === 'Warm' ? 1.08 : 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const send = (preset) => {
    const value = (preset ?? text).trim();
    if (!value) return;
    const answer = `Here's a polished starting point for your request:\n\n${value}\n\nTry reading this aloud and adjust the wording until it feels natural. You can use the play button to hear it spoken.`;
    setMessages((prev) => [...prev, { prompt: value, answer }]);
    setText('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const toggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice input is not supported in this browser. Try Chrome or Edge, or type your message.'); return; }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; recognition.interimResults = true; recognition.continuous = false;
    recognition.onresult = (event) => setText(Array.from(event.results).map((r) => r[0].transcript).join(' '));
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition; recognition.start(); setIsListening(true);
  };

  const copyText = async (value, index) => {
    try { await navigator.clipboard.writeText(value); setCopied(index); setTimeout(() => setCopied(-1), 1600); }
    catch { alert('Copy is unavailable here. Select the text and copy it manually.'); }
  };

  const reset = () => { setMessages([]); setText(''); window.speechSynthesis?.cancel(); setIsSpeaking(false); };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><AudioLines size={21}/></div><span>proxi<span className="brand-accent">speak</span></span><button className="icon-button mobile-close" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={18}/></button></div>
      <button className="new-chat" onClick={reset}><Plus size={17}/> New session <span>⌘ K</span></button>
      <div className="side-label">WORKSPACE</div>
      <button className="nav-item active"><WandSparkles size={17}/> Speak studio</button>
      <button className="nav-item" onClick={() => alert('Your saved sessions will appear here once storage is connected.')}><Headphones size={17}/> Saved sessions <span className="soon">SOON</span></button>
      <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={17}/></div><strong>Your voice, your way.</strong><p>Turn everyday words into something that sounds like you.</p><button onClick={() => inputRef.current?.focus()}>Start creating <span>↗</span></button></div><button className="nav-item muted" onClick={() => alert('Settings can be connected to your backend later.')}><Settings2 size={17}/> Settings</button><button className="nav-item muted" onClick={() => alert('Tip: type a prompt, then use the microphone or speaker controls.')}><CircleHelp size={17}/> Help & tips</button><div className="profile"><div className="avatar">P</div><div className="profile-copy"><strong>Personal workspace</strong><span>Free plan</span></div><ChevronDown size={16} className="profile-chevron"/></div></div>
    </aside>
    {mobileMenu && <button className="scrim" onClick={() => setMobileMenu(false)} aria-label="Close menu"/>}
    <main className="main-area">
      <header className="topbar"><button className="icon-button menu-toggle" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>Speak studio</strong></div><div className="topbar-right"><span className="status-dot"/> <span className="status-text">Ready to speak</span><button className="help-button" onClick={() => alert('ProxiSpeak frontend starter. Connect your API to enable backend-powered responses.')}>?</button></div></header>
      <section className={`content ${messages.length ? 'content-chat' : ''}`}>
        {messages.length === 0 ? <div className="welcome">
          <div className="eyebrow"><span className="eyebrow-spark">✳</span> YOUR SPACE TO SPEAK</div>
          <h1>Find your voice.<br/><span>Say it your way.</span></h1>
          <p className="welcome-sub">A little space to shape your words, practice out loud, and make every conversation feel more natural.</p>
          <div className="feature-pills"><span><AudioLines size={14}/> Voice-first</span><span><Sparkles size={14}/> Made for you</span><span><Volume2 size={14}/> Listen back</span></div>
          <div className="starter-grid">{starters.map((item) => <button className="starter-card" key={item.title} onClick={() => send(item.text)}><span className="starter-icon">{item.icon}</span><strong>{item.title}</strong><span className="starter-text">{item.text}</span><span className="starter-arrow">↗</span></button>)}</div>
        </div> : <div className="conversation"><div className="conversation-heading"><div><div className="eyebrow">YOUR SESSION</div><h2>Let's find the right words.</h2></div><button className="clear-button" onClick={reset}>Clear session</button></div>{messages.map((message, i) => <div className="message-pair" key={`${i}-${message.prompt}`}><div className="user-message"><div className="mini-avatar">You</div><p>{message.prompt}</p></div><div className="assistant-message"><div className="assistant-icon"><AudioLines size={17}/></div><div className="answer-body"><div className="answer-label">PROXISPEAK <span>· DRAFT</span></div><p>{message.answer}</p><div className="answer-actions"><button onClick={() => speak(message.answer)}><Play size={14}/> Listen</button><button onClick={() => copyText(message.answer, i)}>{copied === i ? <Check size={14}/> : <Copy size={14}/>} {copied === i ? 'Copied' : 'Copy text'}</button></div></div></div></div>)}</div>}
        <div className="composer-wrap"><div className="composer"><textarea ref={inputRef} rows={2} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="What would you like to say today?" aria-label="Write your message"/><div className="composer-toolbar"><div className="composer-tools"><button className={`tool-button ${isListening ? 'listening' : ''}`} onClick={toggleMic} title="Speak your prompt"><Mic size={16}/><span>{isListening ? 'Listening…' : 'Use voice'}</span></button><div className="voice-select"><Volume2 size={15}/><select value={voice} onChange={(e) => setVoice(e.target.value)} aria-label="Choose voice style"><option>Calm & clear</option><option>Warm</option><option>Energetic</option><option>Slow & steady</option></select><ChevronDown size={13}/></div></div><button className="send-button" onClick={() => send()} disabled={!text.trim()} aria-label="Send message"><ArrowUp size={18}/></button></div></div><div className="composer-foot"><span><span className="tiny-spark">✳</span> Your ideas, at your pace.</span><span>Enter to send <i>·</i> Shift + Enter for a new line</span></div></div>
      </section>
      <footer className="footer"><span>PROXISPEAK <span className="footer-dot">✳</span></span><span>Made for the way you communicate.</span><button onClick={() => alert('Connect your backend API to power this interface.')}>About this project</button></footer>
    </main>
  </div>;
}
