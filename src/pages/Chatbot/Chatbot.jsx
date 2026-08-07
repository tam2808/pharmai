import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertCircle, Zap } from 'lucide-react';
import ChatBubble from '../../components/features/ChatBubble';
import TypingIndicator from '../../components/features/TypingIndicator';
import PageTransition from '../../components/layout/PageTransition';
import Button from '../../components/ui/Button';
import { getDrugs } from '../../services/drugApi';

// ============================================================
// System Prompt — PharmAI Dược sĩ AI
// ============================================================
const SYSTEM_PROMPT = `Bạn là PharmAI Assistant — một dược sĩ AI thông minh của hệ thống đặt thuốc trực tuyến PharmAI (Việt Nam).

NHIỆM VỤ CỦA BẠN:
- Tư vấn thuốc, liều dùng, chỉ định, chống chỉ định, tác dụng phụ theo triệu chứng người dùng mô tả
- Gợi ý thuốc phù hợp từ danh mục PharmAI dựa trên triệu chứng
- Giải thích thông tin dược phẩm rõ ràng, dễ hiểu bằng tiếng Việt
- Luôn khuyến khích tham khảo bác sĩ/dược sĩ cho các trường hợp nghiêm trọng

DANH MỤC THUỐC PHARMAI (30 loại):
**Giảm đau - Hạ sốt:** Paracetamol 500mg, Ibuprofen 400mg, Aspirin 100mg
**Kháng sinh (cần kê đơn):** Amoxicillin 500mg, Azithromycin 500mg, Ciprofloxacin 500mg
**Tiêu hóa:** Omeprazole 20mg, Domperidone 10mg, Diosmectite 3g, Lactulose 10g
**Dị ứng:** Cetirizine 10mg, Loratadine 10mg
**Tim mạch (cần kê đơn):** Losartan 50mg, Atorvastatin 20mg, Amlodipine 5mg, Bisoprolol 5mg
**Tiểu đường (cần kê đơn):** Metformin 850mg
**Vitamin & Khoáng chất:** Vitamin C 1000mg, Vitamin D3 1000IU, Vitamin B Complex, Sắt Fumarate 200mg
**Hô hấp:** Salbutamol 4mg, Montelukast 10mg, N-Acetylcysteine 600mg
**Xương khớp:** Diclofenac 50mg, Meloxicam 15mg, Glucosamine 500mg
**Da liễu:** Clotrimazole Cream 1%, Hydrocortisone Cream 1%
**Nhãn khoa:** Natri Hyaluronate 0.1% Nhỏ Mắt

QUY TẮC QUAN TRỌNG:
1. Luôn trả lời bằng TIẾNG VIỆT
2. Dùng emoji và format đẹp (bold, bullet points) cho dễ đọc
3. Với thuốc kê đơn: luôn nhắc cần gặp bác sĩ
4. Với triệu chứng nguy hiểm (đau ngực dữ dội, khó thở nặng, đột quỵ): yêu cầu gọi cấp cứu 115 ngay
5. KHÔNG được bịa đặt thông tin thuốc không có trong danh mục — chỉ gợi ý thuốc trong danh sách trên
6. Giữ câu trả lời súc tích, thực dụng, không quá dài
7. Luôn kết thúc bằng lưu ý an toàn ngắn gọn nếu cần thiết`;

const QUICK_SUGGESTIONS = [
  '💊 Paracetamol dùng thế nào?',
  '🌡️ Tôi bị sốt 38 độ uống gì?',
  '🤢 Tôi bị đau bụng, buồn nôn',
  '🦠 Kháng sinh amoxicillin',
  '❤️ Thuốc tim mạch',
  '🤧 Tôi bị ngứa, nổi mề đay',
  '🦴 Thuốc đau khớp gối',
  '😷 Ho có đờm dùng gì?',
];

const WELCOME_MESSAGE = `Xin chào! Tôi là **PharmAI Assistant** 🤖✨

Tôi được hỗ trợ bởi **Google Gemini AI** — có thể hiểu và trả lời mọi câu hỏi về sức khỏe, thuốc và triệu chứng một cách thông minh!

Bạn có thể hỏi tôi bằng ngôn ngữ tự nhiên, ví dụ:
• *"Tôi bị đau bụng, buồn nôn nên uống gì?"*
• *"Paracetamol và Ibuprofen khác nhau như thế nào?"*
• *"Tôi bị dị ứng ngứa toàn thân, cần làm gì?"*

⚠️ *Thông tin chỉ mang tính tham khảo. Luôn hỏi ý kiến bác sĩ hoặc dược sĩ trước khi sử dụng thuốc.*`;

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ============================================================
// Drug Keyword → Search Term mapping (30 loại thuốc PharmAI)
// ============================================================
const DRUG_KEYWORDS_MAP = [
  { keywords: ['paracetamol', 'panadol', 'efferalgan', 'acetaminophen'], search: 'paracetamol' },
  { keywords: ['ibuprofen', 'advil', 'nurofen'], search: 'ibuprofen' },
  { keywords: ['aspirin', 'acid acetylsalicylic'], search: 'aspirin' },
  { keywords: ['amoxicillin'], search: 'amoxicillin' },
  { keywords: ['azithromycin', 'zithromax'], search: 'azithromycin' },
  { keywords: ['ciprofloxacin', 'cipro'], search: 'ciprofloxacin' },
  { keywords: ['omeprazole'], search: 'omeprazole' },
  { keywords: ['domperidone', 'domperidon'], search: 'domperidone' },
  { keywords: ['diosmectite', 'smecta'], search: 'diosmectite' },
  { keywords: ['lactulose'], search: 'lactulose' },
  { keywords: ['cetirizine'], search: 'cetirizine' },
  { keywords: ['loratadine', 'claritin'], search: 'loratadine' },
  { keywords: ['metformin', 'glucophage'], search: 'metformin' },
  { keywords: ['losartan'], search: 'losartan' },
  { keywords: ['atorvastatin', 'lipitor'], search: 'atorvastatin' },
  { keywords: ['amlodipine', 'norvasc'], search: 'amlodipine' },
  { keywords: ['bisoprolol'], search: 'bisoprolol' },
  { keywords: ['vitamin c', 'ascorbic'], search: 'vitamin c' },
  { keywords: ['vitamin d3', 'vitamin d', 'cholecalciferol'], search: 'vitamin d' },
  { keywords: ['vitamin b', 'b complex', 'b12', 'b6'], search: 'vitamin b' },
  { keywords: ['sắt fumarate', 'ferrous', 'thiếu sắt', 'thiếu máu'], search: 'sắt' },
  { keywords: ['salbutamol', 'ventolin'], search: 'salbutamol' },
  { keywords: ['montelukast', 'singulair'], search: 'montelukast' },
  { keywords: ['acetylcysteine', 'nac', 'fluimucil', 'tiêu đờm'], search: 'acetylcysteine' },
  { keywords: ['diclofenac', 'voltaren'], search: 'diclofenac' },
  { keywords: ['meloxicam', 'mobic'], search: 'meloxicam' },
  { keywords: ['glucosamine'], search: 'glucosamine' },
  { keywords: ['clotrimazole', 'canesten'], search: 'clotrimazole' },
  { keywords: ['hydrocortisone'], search: 'hydrocortisone' },
  { keywords: ['hyaluronate', 'nước mắt nhân tạo', 'khô mắt'], search: 'hyaluronate' },
];

/** Extract up to 3 drug search terms from a combined text (user query + AI response) */
const extractDrugSearchTerms = (text) => {
  const lower = text.toLowerCase();
  const found = [];
  for (const item of DRUG_KEYWORDS_MAP) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      found.push(item.search);
      if (found.length >= 3) break;
    }
  }
  return found;
};

/** Fetch drug objects from backend for a list of search terms */
const fetchDrugsForTerms = async (terms) => {
  if (!terms.length) return [];
  try {
    const results = await Promise.all(
      terms.map((term) => getDrugs({ search: term }).catch(() => null))
    );
    return results
      .filter(Boolean)
      .flatMap((r) => (r.data && Array.isArray(r.data) ? r.data.slice(0, 1) : []))
      .filter(Boolean)
      .slice(0, 3);
  } catch {
    return [];
  }
};

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 'welcome', sender: 'bot', text: WELCOME_MESSAGE, timestamp: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState(null);
  const scrollRef = useRef(null);
  const chatHistoryRef = useRef([]); // lưu lịch sử chat để gửi context cho Gemini

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getBotReply = async (userText) => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      return '⚠️ Chưa cấu hình Groq API Key. Vui lòng thêm VITE_GROQ_API_KEY vào file .env.local';
    }

    // Thêm message mới vào history (format OpenAI)
    chatHistoryRef.current.push({ role: 'user', content: userText });

    // Giới hạn history 20 turns để tránh vượt token limit
    if (chatHistoryRef.current.length > 20) {
      chatHistoryRef.current = chatHistoryRef.current.slice(-20);
    }

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...chatHistoryRef.current,
          ],
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 0.95,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('Groq API error:', errData);
        const errMsg = errData?.error?.message || `HTTP ${response.status}`;
        throw new Error(errMsg);
      }

      const data = await response.json();
      console.log('Groq response:', data);

      const botText = data?.choices?.[0]?.message?.content || 'Xin lỗi, tôi không thể xử lý yêu cầu này.';

      // Lưu response vào history
      chatHistoryRef.current.push({ role: 'assistant', content: botText });

      setApiError(null);
      return botText;
    } catch (err) {
      console.error('Groq error:', err);
      setApiError(err.message);
      // Xóa message user cuối để tránh lặp
      if (chatHistoryRef.current.at(-1)?.role === 'user') {
        chatHistoryRef.current.pop();
      }

      const msg = err.message || '';
      if (msg.includes('429') || msg.includes('rate_limit') || msg.includes('quota')) {
        return `⏳ **Vượt giới hạn request**\n\nVui lòng đợi 1 phút rồi thử lại.`;
      } else if (msg.includes('401') || msg.includes('invalid_api_key')) {
        return `🔑 **API Key không hợp lệ**\n\nVui lòng kiểm tra lại Groq API Key tại [console.groq.com](https://console.groq.com/keys)`;
      }
      return `❌ **Lỗi kết nối AI**\n\n\`${msg}\`\n\n💡 Vui lòng thử lại sau.`;
    }
  };

  const handleSend = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // 1. Get AI reply
    const reply = await getBotReply(trimmed);

    // 2. Extract drug names from user query + AI response, then fetch product cards
    const searchTerms = extractDrugSearchTerms(trimmed + ' ' + reply);
    const drugs = await fetchDrugsForTerms(searchTerms);

    const botMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: reply,
      drugs,           // attach drug cards to the message
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <PageTransition className="flex flex-col bg-bg h-[calc(100vh-64px)] lg:h-[calc(100vh-72px)] overflow-hidden">

      {/* Title Bar */}
      <div className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary text-base font-display">Tư vấn Dược phẩm AI</h2>
            <div className="flex items-center gap-1.5 text-xs text-success font-medium">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              Powered by Gemini AI · 30 loại thuốc
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {apiError && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-lg">
              <AlertCircle size={14} />
              Lỗi API Key
            </div>
          )}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-warning/8 border border-warning/10 text-warning text-xs font-semibold rounded-lg">
            <AlertCircle size={14} />
            Dữ liệu tham khảo — Hỏi ý kiến bác sĩ
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 flex flex-col">
        <div className="max-w-[720px] w-full mx-auto space-y-4 flex flex-col flex-1">
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isTyping && (
            <div className="self-start pl-11">
              <TypingIndicator />
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Quick Suggestions — chỉ hiện khi chưa chat nhiều */}
      {messages.length <= 2 && (
        <div className="px-6 pb-2 shrink-0">
          <div className="max-w-[720px] w-full mx-auto">
            <p className="text-[11px] text-text-secondary font-medium mb-2 flex items-center gap-1">
              <Zap size={11} className="text-primary" />
              Gợi ý câu hỏi nhanh
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  disabled={isTyping}
                  className="px-3 py-1.5 text-xs font-medium bg-surface border border-border rounded-full text-text-secondary hover:text-primary hover:border-primary/40 transition-all hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-surface border-t border-border p-4 shrink-0 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-[720px] w-full mx-auto flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi về triệu chứng, thuốc, liều dùng... (AI sẽ tự trả lời)"
            className="flex-1 bg-bg border border-border rounded-xl px-4 py-3.5 text-sm text-text-primary outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(11,61,46,0.1)]"
            disabled={isTyping}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!input.trim() || isTyping}
            className="rounded-xl px-4 h-12"
            icon={<Send size={16} />}
          />
        </form>
      </div>
    </PageTransition>
  );
}
