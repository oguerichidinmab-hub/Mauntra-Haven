/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Home, 
  Shield, 
  PhoneCall, 
  BookOpen, 
  MessageCircle, 
  User, 
  LogOut, 
  Plus, 
  Trash2, 
  ChevronRight, 
  AlertTriangle,
  Heart,
  Wind,
  Info,
  Settings,
  EyeOff,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  TrustedContact, 
  SupportService, 
  IncidentNote, 
  UserSettings, 
  AppScreen 
} from './types';
import { MOCK_SERVICES, GROUNDING_TECHNIQUES, LEGAL_RIGHTS } from './constants';

// --- Context ---

interface AppContextType {
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
  contacts: TrustedContact[];
  setContacts: (c: TrustedContact[]) => void;
  notes: IncidentNote[];
  setNotes: (n: IncidentNote[]) => void;
  currentScreen: AppScreen;
  setCurrentScreen: (s: AppScreen) => void;
  isSafetyMode: boolean;
  toggleSafetyMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// --- Components ---

const QuickExitButton = () => {
  const { toggleSafetyMode } = useApp();
  return (
    <button 
      onClick={toggleSafetyMode}
      className="bg-rose-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-transform"
      id="quick-exit-btn"
    >
      <EyeOff size={18} />
      <span>QUICK EXIT</span>
    </button>
  );
};

const BottomNav = () => {
  const { currentScreen, setCurrentScreen } = useApp();
  
  const navItems: { id: AppScreen; icon: any; label: string }[] = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'support', icon: Shield, label: 'Support' },
    { id: 'emergency', icon: PhoneCall, label: 'Emergency' },
    { id: 'resources', icon: BookOpen, label: 'Resources' },
    { id: 'assistant', icon: MessageCircle, label: 'AI' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 py-3 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentScreen(item.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentScreen === item.id ? 'text-indigo-600' : 'text-slate-400'
          }`}
          id={`nav-${item.id}`}
        >
          <item.icon size={22} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

// --- Screens ---

const HomeScreen = () => {
  const { settings, setCurrentScreen, contacts } = useApp();
  
  return (
    <div className="p-6 pb-24 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-800">Welcome, {settings.nickname}</h1>
        <p className="text-slate-500 italic">"You are safe, you are strong, and you are not alone."</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setCurrentScreen('emergency')}
          className="bg-rose-50 p-4 rounded-2xl flex flex-col items-center gap-3 border border-rose-100 active:bg-rose-100 transition-colors"
        >
          <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white">
            <PhoneCall size={24} />
          </div>
          <span className="font-semibold text-rose-700">Emergency</span>
        </button>
        
        <button 
          onClick={() => setCurrentScreen('assistant')}
          className="bg-indigo-50 p-4 rounded-2xl flex flex-col items-center gap-3 border border-indigo-100 active:bg-indigo-100 transition-colors"
        >
          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
            <MessageCircle size={24} />
          </div>
          <span className="font-semibold text-indigo-700">AI Assistant</span>
        </button>
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Trusted Contacts</h2>
          <button onClick={() => setCurrentScreen('profile')} className="text-indigo-600 text-sm font-medium">Manage</button>
        </div>
        {contacts.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {contacts.map(contact => (
              <a 
                key={contact.id} 
                href={`tel:${contact.phone}`}
                className="flex-shrink-0 w-20 flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200">
                  <User size={24} />
                </div>
                <span className="text-xs font-medium text-slate-700 truncate w-full text-center">{contact.name}</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 text-center">
            <p className="text-sm text-slate-500">No trusted contacts added yet.</p>
          </div>
        )}
      </section>

      <section className="bg-indigo-600 p-6 rounded-3xl text-white space-y-4 shadow-xl shadow-indigo-100">
        <div className="flex items-center gap-3">
          <Shield size={24} />
          <h2 className="text-xl font-bold">Safety First</h2>
        </div>
        <p className="text-indigo-100 text-sm leading-relaxed">
          Remember to use the Quick Exit button if you feel unsafe. Your privacy is our top priority.
        </p>
      </section>
    </div>
  );
};

const SupportScreen = () => {
  const [filter, setFilter] = useState<string>('all');
  
  const filteredServices = filter === 'all' 
    ? MOCK_SERVICES 
    : MOCK_SERVICES.filter(s => s.type === filter);

  return (
    <div className="p-6 pb-24 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">Support Services</h1>
        <p className="text-slate-500 text-sm">Find professional help near you.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'shelter', 'legal', 'counseling', 'health'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize flex-shrink-0 transition-colors ${
              filter === f ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-slate-800">{service.name}</h3>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                {service.type}
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{service.description}</p>
            <div className="flex items-center gap-4 pt-2">
              <a href={`tel:${service.contact}`} className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-xl text-center text-sm font-bold active:bg-indigo-100 transition-colors">
                Call Now
              </a>
              <button className="flex-1 bg-slate-50 text-slate-700 py-2 rounded-xl text-center text-sm font-bold active:bg-slate-100 transition-colors">
                Directions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmergencyScreen = () => {
  const { contacts } = useApp();
  
  return (
    <div className="p-6 pb-24 space-y-8">
      <header className="text-center space-y-4">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mx-auto">
          <AlertTriangle size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Emergency Help</h1>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          If you are in immediate danger, please call emergency services or a trusted contact right away.
        </p>
      </header>

      <div className="space-y-4">
        <a 
          href="tel:911" 
          className="w-full bg-rose-600 text-white p-6 rounded-3xl flex items-center justify-between shadow-xl shadow-rose-100 active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <PhoneCall size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold text-xl">Call 911</p>
              <p className="text-rose-100 text-sm">Emergency Services</p>
            </div>
          </div>
          <ChevronRight size={24} />
        </a>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <User size={18} className="text-indigo-600" />
            Trusted Contacts
          </h2>
          <div className="space-y-3">
            {contacts.map(contact => (
              <a 
                key={contact.id} 
                href={`tel:${contact.phone}`}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl active:bg-slate-100 transition-colors"
              >
                <div>
                  <p className="font-bold text-slate-800">{contact.name}</p>
                  <p className="text-xs text-slate-500">{contact.relation}</p>
                </div>
                <PhoneCall size={18} className="text-indigo-600" />
              </a>
            ))}
            {contacts.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4 italic">No trusted contacts added.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 space-y-3">
        <h3 className="font-bold text-amber-800 flex items-center gap-2">
          <Info size={18} />
          Safety Instructions
        </h3>
        <ul className="text-sm text-amber-700 space-y-2 list-disc pl-5">
          <li>Find a safe space away from the situation.</li>
          <li>Keep your phone charged and nearby.</li>
          <li>If possible, have an emergency bag ready.</li>
        </ul>
      </div>
    </div>
  );
};

const ResourcesScreen = () => {
  const [activeTab, setActiveTab] = useState<'rights' | 'grounding' | 'notes'>('rights');
  const { notes, setNotes } = useApp();
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note: IncidentNote = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      content: newNote
    };
    setNotes([note, ...notes]);
    setNewNote('');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="p-6 pb-24 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">Resources</h1>
        <p className="text-slate-500 text-sm">Information and tools for your wellbeing.</p>
      </header>

      <div className="flex bg-slate-100 p-1 rounded-xl">
        {(['rights', 'grounding', 'notes'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
              activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'rights' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {LEGAL_RIGHTS.map((right, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                <h3 className="font-bold text-slate-800">{right.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{right.content}</p>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'grounding' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {GROUNDING_TECHNIQUES.map((tech, i) => (
              <div key={i} className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Wind size={18} />
                  <h3 className="font-bold">{tech.title}</h3>
                </div>
                <p className="text-sm text-indigo-600 leading-relaxed">{tech.description}</p>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'notes' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="space-y-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Record an incident or a thought privately..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
              />
              <button 
                onClick={handleAddNote}
                className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <Plus size={18} />
                Save Private Note
              </button>
            </div>

            <div className="space-y-4">
              {notes.map(note => (
                <div key={note.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">{note.date}</span>
                    <button onClick={() => deleteNote(note.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                    <BookOpen size={32} />
                  </div>
                  <p className="text-slate-400 text-sm italic">Your private journal is empty.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AssistantScreen = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello, I am MAUNTRA Assistant. I am here to offer supportive guidance and help you find resources. How can I support you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: `You are MAUNTRA Assistant, a trauma-informed, supportive, and non-judgmental AI for domestic violence survivors. 
          Your goals:
          1. Provide calm, encouraging messages.
          2. Help users find resources (shelters, legal aid, counseling).
          3. Prioritize safety. If a user is in danger, strongly encourage them to use the Emergency button or call 911.
          4. Never blame the survivor.
          5. Remind users that you are an AI and not a replacement for professional help.
          6. Keep responses concise and easy to read on mobile.
          7. Use soft, empathetic language.`
        }
      });
      
      setMessages(prev => [...prev, { role: 'ai', text: response.text || 'I am here for you. How else can I help?' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'I am having a little trouble connecting, but I am still here for you. Please try again or check the Resources section.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <header className="p-6 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <MessageCircle size={20} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800">MAUNTRA Assistant</h1>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Supportive AI</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-700 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-3">
          AI support is not a replacement for professional care.
        </p>
      </div>
    </div>
  );
};

const ProfileScreen = () => {
  const { settings, setSettings, contacts, setContacts } = useApp();
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setContacts([...contacts, { ...newContact, id: Date.now().toString() }]);
    setNewContact({ name: '', phone: '', relation: '' });
    setIsAddingContact(false);
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="p-6 pb-24 space-y-8">
      <header className="flex items-center gap-4">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{settings.nickname}</h1>
          <p className="text-slate-500 text-sm">Your private profile</p>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <PhoneCall size={18} className="text-indigo-600" />
          Trusted Contacts
        </h2>
        <div className="space-y-3">
          {contacts.map(contact => (
            <div key={contact.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div>
                <p className="font-bold text-slate-800">{contact.name}</p>
                <p className="text-xs text-slate-500">{contact.phone} • {contact.relation}</p>
              </div>
              <button onClick={() => removeContact(contact.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          {isAddingContact ? (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <input 
                placeholder="Name" 
                value={newContact.name}
                onChange={e => setNewContact({...newContact, name: e.target.value})}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
              />
              <input 
                placeholder="Phone Number" 
                value={newContact.phone}
                onChange={e => setNewContact({...newContact, phone: e.target.value})}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
              />
              <input 
                placeholder="Relation (e.g. Friend)" 
                value={newContact.relation}
                onChange={e => setNewContact({...newContact, relation: e.target.value})}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
              />
              <div className="flex gap-2">
                <button onClick={handleAddContact} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold">Add</button>
                <button onClick={() => setIsAddingContact(false)} className="flex-1 bg-slate-200 text-slate-600 py-2 rounded-lg text-sm font-bold">Cancel</button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsAddingContact(true)}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-2 active:bg-slate-50 transition-colors"
            >
              <Plus size={20} />
              Add Trusted Contact
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <Settings size={18} className="text-indigo-600" />
          App Settings
        </h2>
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 flex items-center justify-between border-b border-slate-50">
            <span className="text-sm font-medium text-slate-700">Notifications</span>
            <button 
              onClick={() => setSettings({...settings, notificationsEnabled: !settings.notificationsEnabled})}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.notificationsEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <div className="p-4 flex items-center justify-between border-b border-slate-50">
            <span className="text-sm font-medium text-slate-700">High Contrast</span>
            <button 
              onClick={() => setSettings({...settings, isHighContrast: !settings.isHighContrast})}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.isHighContrast ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.isHighContrast ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Large Text</span>
            <button 
              onClick={() => setSettings({...settings, isLargeText: !settings.isLargeText})}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.isLargeText ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.isLargeText ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </section>

      <button className="w-full py-4 text-rose-500 font-bold flex items-center justify-center gap-2 active:bg-rose-50 rounded-2xl transition-colors">
        <LogOut size={20} />
        Reset App Data
      </button>
    </div>
  );
};

const OnboardingScreen = () => {
  const { setSettings, setCurrentScreen } = useApp();
  const [nickname, setNickname] = useState('');
  const [step, setStep] = useState(1);

  const handleComplete = () => {
    if (!nickname.trim()) return;
    setSettings({
      nickname: nickname,
      language: 'en',
      isHighContrast: false,
      isLargeText: false,
      isSimpleUI: false,
      notificationsEnabled: true,
      quickExitRedirect: 'https://www.google.com/search?q=weather'
    });
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex flex-col text-white p-8">
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center">
                <Shield size={40} />
              </div>
              <h1 className="text-4xl font-bold leading-tight">Welcome to MAUNTRA Haven.</h1>
              <p className="text-indigo-100 text-lg leading-relaxed">
                A safe, private space for you. Your safety and privacy are our only priorities.
              </p>
              <button 
                onClick={() => setStep(2)}
                className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-transform"
              >
                Get Started
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">What should we call you?</h2>
              <p className="text-indigo-100">Use a nickname for your safety. This is only stored on your device.</p>
              <input
                autoFocus
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Your nickname"
                className="w-full bg-white/10 border-2 border-white/20 rounded-2xl p-5 text-xl placeholder:text-white/40 focus:outline-none focus:border-white"
              />
              <button 
                onClick={handleComplete}
                disabled={!nickname.trim()}
                className="w-full bg-white text-indigo-600 py-5 rounded-2xl font-bold text-xl shadow-xl disabled:opacity-50 active:scale-95 transition-transform"
              >
                Enter Haven
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="py-8 text-center">
        <p className="text-indigo-200 text-[10px] uppercase tracking-widest font-bold">
          Survivor-Centered • Private • Secure
        </p>
      </div>
    </div>
  );
};

const SafetyRedirect = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
        <Search size={48} />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">Searching...</h1>
        <p className="text-slate-500">Checking for local weather updates and news.</p>
      </div>
      <div className="w-full max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '60%' }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-full bg-slate-300"
        />
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="text-slate-300 text-sm"
      >
        Tap to refresh
      </button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('onboarding');
  const [isSafetyMode, setIsSafetyMode] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('mauntra_settings');
    return saved ? JSON.parse(saved) : null;
  });
  const [contacts, setContacts] = useState<TrustedContact[]>(() => {
    const saved = localStorage.getItem('mauntra_contacts');
    return saved ? JSON.parse(saved) : [];
  });
  const [notes, setNotes] = useState<IncidentNote[]>(() => {
    const saved = localStorage.getItem('mauntra_notes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (settings) {
      localStorage.setItem('mauntra_settings', JSON.stringify(settings));
      if (currentScreen === 'onboarding') setCurrentScreen('home');
    }
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('mauntra_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('mauntra_notes', JSON.stringify(notes));
  }, [notes]);

  const toggleSafetyMode = () => {
    setIsSafetyMode(true);
    // In a real app, we might redirect to a real external URL
    // window.location.href = settings?.quickExitRedirect || 'https://google.com';
  };

  if (isSafetyMode) return <SafetyRedirect />;
  if (currentScreen === 'onboarding' && !settings) return (
    <AppContext.Provider value={{ settings: {} as any, setSettings, contacts, setContacts, notes, setNotes, currentScreen, setCurrentScreen, isSafetyMode, toggleSafetyMode }}>
      <OnboardingScreen />
    </AppContext.Provider>
  );

  return (
    <AppContext.Provider value={{ settings: settings!, setSettings, contacts, setContacts, notes, setNotes, currentScreen, setCurrentScreen, isSafetyMode, toggleSafetyMode }}>
      <div className={`min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 ${settings?.isLargeText ? 'text-lg' : 'text-base'} ${settings?.isHighContrast ? 'contrast-125' : ''}`}>
        
        {/* Top Bar */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Shield size={18} />
            </div>
            <span className="font-bold text-slate-800 tracking-tight">MAUNTRA</span>
          </div>
          <QuickExitButton />
        </header>

        {/* Main Content */}
        <main className="pt-16 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentScreen === 'home' && <HomeScreen />}
              {currentScreen === 'support' && <SupportScreen />}
              {currentScreen === 'emergency' && <EmergencyScreen />}
              {currentScreen === 'resources' && <ResourcesScreen />}
              {currentScreen === 'assistant' && <AssistantScreen />}
              {currentScreen === 'profile' && <ProfileScreen />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Global Disclaimer */}
        <div className="fixed bottom-20 left-4 right-4 bg-slate-800/90 backdrop-blur-sm text-white text-[9px] p-2 rounded-lg text-center opacity-50 pointer-events-none z-40">
          MAUNTRA Haven supports you but does not replace emergency services or professional care.
        </div>
      </div>
    </AppContext.Provider>
  );
}
