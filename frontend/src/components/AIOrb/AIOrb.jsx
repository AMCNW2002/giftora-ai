import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Gift, Truck, HelpCircle } from 'lucide-react';
import { api } from '../../services/api';
import './AIOrb.css';

export function AIOrb() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Warm greetings! 🌸 I'm your Giftora AI Concierge. How can I assist you with gift ideas, custom gift boxes, or shipping questions today?"
    }
  ]);

  const chatEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || inputMessage.trim();
    if (!messageText) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageText
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call mock api
      const response = await api.chat(messageText);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: response.reply
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "I'm having a momentary connection flutter, but I'm here to help! Feel free to ask about our gift collections or custom boxes."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="giftora-ai-orb-container">
      {/* Floating Circular Trigger Orb */}
      {!isOpen && (
        <button
          type="button"
          className="giftora-ai-orb"
          onClick={() => setIsOpen(true)}
          aria-label="Open Giftora AI Concierge"
          title="Chat with Giftora AI"
        >
          <div className="giftora-ai-orb__pulse-ring" />
          <div className="giftora-ai-orb__glow" />
          <Sparkles size={24} className="giftora-ai-orb__icon" />
          <span className="giftora-ai-orb__tooltip">Ask AI Concierge</span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="giftora-ai-chat-window animate-fade-up">
          {/* Header */}
          <div className="giftora-ai-chat__header">
            <div className="giftora-ai-chat__header-info">
              <div className="giftora-ai-chat__avatar">
                <Sparkles size={16} />
              </div>
              <div>
                <h4>Giftora AI Concierge</h4>
                <span className="giftora-ai-chat__status">
                  <span className="status-dot" /> Online • Ready to help
                </span>
              </div>
            </div>
            <button
              type="button"
              className="giftora-ai-chat__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="giftora-ai-chat__quick-prompts">
            <button
              type="button"
              onClick={() => handleSendMessage('What are your most popular anniversary gifts?')}
            >
              <Gift size={12} /> Popular gifts
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('How does free shipping work?')}
            >
              <Truck size={12} /> Shipping info
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage('How do I build a custom gift box?')}
            >
              <HelpCircle size={12} /> Box builder
            </button>
          </div>

          {/* Message History List */}
          <div className="giftora-ai-chat__messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`giftora-ai-chat__msg giftora-ai-chat__msg--${msg.sender}`}
              >
                <div className="giftora-ai-chat__msg-bubble">{msg.text}</div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="giftora-ai-chat__msg giftora-ai-chat__msg--bot">
                <div className="giftora-ai-chat__msg-bubble giftora-ai-chat__typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="giftora-ai-chat__input-area"
          >
            <input
              type="text"
              placeholder="Ask about gifts, budget, shipping..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="submit"
              className="giftora-ai-chat__send-btn"
              disabled={!inputMessage.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AIOrb;
