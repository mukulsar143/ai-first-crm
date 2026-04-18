import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendChatMessage } from '../store/slices/chatSlice';
import { fetchInteractions } from '../store/slices/interactionSlice';
import { Sparkles, Send, Info, Loader2 } from 'lucide-react';
import { cn } from '../utils';

const AIChat = () => {
    const dispatch = useDispatch();
    const { messages, loading, error } = useSelector((state) => state.chat);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const currentInput = input;
        setInput('');

        try {
            const result = await dispatch(sendChatMessage(currentInput)).unwrap();
            if (result.success) {
                // Refresh history if successful logging occurred
                dispatch(fetchInteractions());
            }
        } catch (err) {
            console.error("AI Chat failed:", err);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header */}
            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-600">
                        <div className="bg-blue-100 p-1.5 rounded-lg">
                            <Sparkles size={16} fill="currentColor" className={loading ? "animate-pulse" : ""} />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900">AI Assistant</h3>
                    </div>
                    <button className="text-gray-300 hover:text-gray-500">
                        <Info size={14} />
                    </button>
                </div>
                <p className="text-[12px] text-gray-500 leading-normal">
                    Log interaction via natural language or ask for data insights.
                </p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white border border-blue-100 rounded-xl p-6 relative overflow-hidden flex flex-col min-h-[300px]">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-center space-y-0 text-blue-600/80 italic text-[13px] leading-relaxed">
                        <p>"Log interaction details here</p>
                        <p>(e.g. 'Met Dr. Smith, discussed</p>
                        <p>Product X efficacy, shared</p>
                        <p>brochure')"</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2 pb-4">
                        {messages.map((m, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "p-3 rounded-lg text-xs leading-relaxed max-w-[90%]",
                                    m.role === 'user'
                                        ? "bg-blue-600 text-white self-end ml-4 shadow-sm"
                                        : "bg-gray-100 text-gray-700 self-start mr-4 border border-gray-100"
                                )}
                            >
                                {m.content}
                            </div>
                        ))}
                        {loading && (
                            <div className="bg-gray-100 text-gray-400 p-3 rounded-lg text-xs italic self-start border border-gray-100 flex items-center gap-2">
                                <Loader2 size={12} className="animate-spin" />
                                Processing interaction...
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-[11px] self-center border border-red-100 text-center">
                                {error}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="relative">
                <input
                    placeholder={loading ? "Analyzing..." : "Describe interaction..."}
                    disabled={loading}
                    className="w-full h-10 pl-4 pr-10 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-500 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:text-blue-700 transition-colors disabled:text-gray-300"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
            </div>
        </div>
    );
};

export default AIChat;
