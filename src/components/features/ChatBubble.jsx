import { motion } from 'framer-motion';
import { Pill } from 'lucide-react';
import { cn } from '../../utils/helpers';
import ChatDrugCard from './ChatDrugCard';

/**
 * renderMarkdown — Convert basic markdown syntax to JSX elements.
 * Handles: **bold**, *italic*, `code`, and newlines.
 */
function renderMarkdown(text) {
  if (!text) return null;

  return text.split('\n').map((line, lineIdx) => {
    if (!line.trim()) return <br key={lineIdx} />;

    // Parse inline: **bold**, *italic*, `code`
    const tokens = [];
    let remaining = line;
    let key = 0;

    const patterns = [
      { regex: /\*\*(.*?)\*\*/g, render: (m) => <strong key={key++} className="font-semibold">{m}</strong> },
      { regex: /\*(.*?)\*/g, render: (m) => <em key={key++}>{m}</em> },
      { regex: /`([^`]+)`/g, render: (m) => <code key={key++} className="px-1 py-0.5 bg-black/5 rounded text-[11px] font-mono">{m}</code> },
    ];

    // Simple sequential inline parser
    const parts = parseInline(line, key);

    return (
      <span key={lineIdx} className="block">
        {parts}
      </span>
    );
  });
}

function parseInline(text, startKey = 0) {
  let key = startKey;
  const result = [];
  // Combined regex: **bold** | *italic* | `code`
  const regex = /(\*\*(.*?)\*\*|\*(.*?)\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    if (match[0].startsWith('**')) {
      result.push(<strong key={key++} className="font-semibold">{match[2]}</strong>);
    } else if (match[0].startsWith('*')) {
      result.push(<em key={key++}>{match[3]}</em>);
    } else if (match[0].startsWith('`')) {
      result.push(
        <code key={key++} className="px-1 py-0.5 bg-black/5 rounded text-[11px] font-mono">
          {match[4]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}

/**
 * ChatBubble — Renders a single chat message bubble.
 * Bot messages support markdown + drug product cards.
 */
export default function ChatBubble({ message }) {
  const isBot = message.sender === 'bot';
  const hasDrugs = isBot && message.drugs?.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'flex flex-col',
        isBot ? 'self-start items-start' : 'self-end items-end'
      )}
    >
      {/* Bubble row */}
      <div className={cn('flex items-end gap-3', isBot ? '' : 'flex-row-reverse')}>
        {/* Bot Avatar */}
        {isBot && (
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center border border-primary/10 shrink-0 shadow-sm text-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
              <path d="m19 5-3 3M19 19l-3-3M5 19l3 3M5 5l3 3" className="stroke-accent" strokeWidth="2" />
            </svg>
          </div>
        )}

        {/* Bubble Content */}
        <div
          className={cn(
            'px-4 py-3 text-sm leading-relaxed shadow-sm border max-w-[75vw] sm:max-w-[480px]',
            isBot
              ? 'bg-surface border-border text-text-primary rounded-2xl rounded-bl-sm'
              : 'bg-primary border-primary text-white rounded-2xl rounded-br-sm'
          )}
        >
          {isBot ? (
            <div className="space-y-0.5">
              {renderMarkdown(message.text)}
            </div>
          ) : (
            <p className="whitespace-pre-line">{message.text}</p>
          )}

          {/* Timestamp */}
          <span
            className={cn(
              'block text-[9px] mt-1.5 text-right',
              isBot ? 'text-text-secondary/60' : 'text-white/60'
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Drug Cards — rendered below the bubble, aligned with bot side */}
      {hasDrugs && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="ml-11 mt-2.5 max-w-[calc(100vw-80px)] sm:max-w-[540px]"
        >
          <p className="text-[10px] text-text-muted font-medium mb-2 flex items-center gap-1">
            <Pill size={10} className="text-primary" />
            Sản phẩm liên quan — Bấm để xem chi tiết &amp; mua
          </p>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
            {message.drugs.map((drug, i) => (
              <ChatDrugCard key={drug.id} drug={drug} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
