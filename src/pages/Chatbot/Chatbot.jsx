import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Pill, AlertCircle, ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { addToCart } from '../../store/cartSlice';
import { formatCurrency } from '../../utils/helpers';
import { toast } from 'sonner';

function TypingDots() {
  return (
    <div className="flex gap-1.5 items-center py-1 px-1">
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
    </div>
  );
}

function generateSmartResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('sốt') || q.includes('đau')) {
    return {
      text: `Đối với triệu chứng **sốt hoặc đau (đau đầu, đau cơ, sốt do cảm cúm)**, Dược sĩ AI PharmAI gợi ý:\n\n1. **Paracetamol 500mg**: Liều dùng 1 viên/lần, cách nhau 4-6 giờ (không quá 4g/ngày).\n2. **Ibuprofen 400mg**: Dùng khi đau nhiều hoặc sốt không giảm sau khi đã dùng Paracetamol.\n\n⚠️ *Cảnh báo an toàn*: Nếu sốt cao trên 38.5°C kéo dài quá 3 ngày hoặc có triệu chứng khó thở, vui lòng đến cơ sở y tế gần nhất.`,
      drugs: [
        { id: 1, name: 'Paracetamol 500mg', price: 25000, activeIngredient: 'Paracetamol', unit: 'Hộp 10 vỉ', image: '/images/paracetamol.png' },
        { id: 2, name: 'Ibuprofen 400mg', price: 45000, activeIngredient: 'Ibuprofen', unit: 'Hộp 3 vỉ', image: '/images/ibuprofen.png' }
      ]
    };
  } 
  
  if (q.includes('dị ứng') || q.includes('ngứa') || q.includes('mề đai')) {
    return {
      text: `Đối với triệu chứng **dị ứng thời tiết, mẩn ngứa, phát ban**:\n\n1. **Cetirizine 10mg**: Uống 1 viên/ngày (kháng histamine thế hệ mới, ít gây buồn ngủ).\n2. **Loratadine 10mg**: Giảm ngứa và chảy nước mũi hiệu quả.\n\n⚠️ *Lời khuyên*: Uống đủ 2 lít nước mỗi ngày và tránh tiếp xúc với tác nhân nghi ngờ gây dị ứng.`,
      drugs: [
        { id: 3, name: 'Cetirizine 10mg', price: 35000, activeIngredient: 'Cetirizine Dihydrochloride', unit: 'Hộp 100 viên', image: '/images/cetirizine.png' }
      ]
    };
  } 

  if (q.includes('ho') || q.includes('cảm') || q.includes('viêm họng')) {
    return {
      text: `Đối với triệu chứng **cảm cúm, ho hắt hơi, đau rát họng**:\n\n1. **Súc họng bằng nước muối sinh lý 0.9%** 3-4 lần/ngày.\n2. **Vitamin C 500mg**: Uống 1 viên/ngày sau ăn sáng để tăng sức đề kháng.\n3. Sử dụng các loại **Siro ho thảo dược** dịu họng.`,
      drugs: [
        { id: 4, name: 'Vitamin C 500mg', price: 60000, activeIngredient: 'Acid Ascorbic', unit: 'Hộp 20 viên sủi', image: '/images/vitamin_c.png' }
      ]
    };
  } 

  if (q.includes('dạ dày') || q.includes('ợ chua') || q.includes('bao tử')) {
    return {
      text: `Đối với triệu chứng **đau dạ dày, trào ngược, ợ chua**:\n\n1. **Omeprazole 20mg**: Giảm tiết acid dạ dày.\n2. **Yumangel**: Uống 1 gói trước bữa ăn 30 phút hoặc khi đau.\n\n⚠️ *Lưu ý*: Tham khảo ý kiến Dược sĩ nếu triệu chứng đau kéo dài.`,
      drugs: [
        { id: 18, name: 'Omeprazole 20mg', price: 42000, activeIngredient: 'Omeprazole', unit: 'Hộp 3 vỉ x 10 viên', image: '/images/omeprazole.png' }
      ]
    };
  }

  return {
    text: `Cảm ơn bạn đã hỏi về: "**${query}**".\n\nDược sĩ AI PharmAI xin tư vấn tổng quát:\n- Vui lòng đọc kỹ thông tin liều dùng và chỉ định trên bao bì sản phẩm.\n- Nếu bạn đang điều trị bệnh lý nền hoặc đang mang thai, nên tham khảo ý kiến bác sĩ trước khi dùng thuốc.\n- Bạn có thể tra cứu chi tiết danh mục thuốc tại thanh tìm kiếm của PharmAI.`,
    drugs: []
  };
}

export default function Chatbot() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'bot',
      text: 'Xin chào! Tôi là **Trợ lý Dược sĩ AI PharmAI**. Bạn cần tư vấn về triệu chứng (sốt, ho, dị ứng...) hay cần tra cứu thông tin loại thuốc nào?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef(null);

  const initialHandledRef = useRef(false);

  // Ensure window starts at the top when entering Chatbot page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (initialQuery && initialQuery.trim() && !initialHandledRef.current) {
      initialHandledRef.current = true;
      handleSend(initialQuery.trim());
    }
  }, [initialQuery]);

  // Scroll ONLY the inner message container to bottom (NEVER scroll the browser window)
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isTyping]);


  function handleSend(queryText) {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now(), from: 'user', text: textToSend };
    setMessages((m) => [...m, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    axios
      .post('http://localhost:5000/api/chat', { message: textToSend }, { timeout: 2500 })
      .then((res) => {
        setIsTyping(false);
        const { response, drugs = [], source } = res.data;
        const botMsg = {
          id: Date.now() + 1,
          from: 'bot',
          text: response,
          drugs,
          source,
        };
        setMessages((m) => [...m, botMsg]);
      })
      .catch(() => {
        setTimeout(() => {
          setIsTyping(false);
          const aiData = generateSmartResponse(textToSend);
          const botMsg = {
            id: Date.now() + 1,
            from: 'bot',
            text: aiData.text,
            drugs: aiData.drugs,
          };
          setMessages((m) => [...m, botMsg]);
        }, 500);
      });
  }

  const handleAddToCart = (drug) => {
    dispatch(addToCart(drug));
    toast.success(`Đã thêm ${drug.name} vào giỏ hàng`);
  };

  return (
    <main className="min-h-screen bg-background pb-10 pt-2 sm:pt-3">
      <div className="max-w-[1020px] mx-auto px-4 sm:px-6">
        
        {/* Compact Header Title positioned right at top */}
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary text-white flex items-center justify-center shrink-0 shadow-md">
              <Bot size={22} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary flex items-center gap-2">
                Hỏi đáp sức khỏe & <span className="gradient-text">Dược sĩ AI</span>
              </h1>
              <p className="text-xs text-text-muted">Tư vấn triệu chứng, liều dùng & tương tác thuốc 24/7</p>
            </div>
          </div>

          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-xs shrink-0 self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Pharmacist Online 24/7
          </span>
        </div>

        {/* Chat Box Container Positioned High Up */}
        <Card className="p-0 overflow-hidden shadow-card border border-border rounded-3xl">
          <div className="h-[480px] sm:h-[520px] max-h-[60vh] flex flex-col bg-surface">

            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" ref={listRef}>
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-start gap-3 max-w-[90%] sm:max-w-[80%]">
                      {m.from === 'bot' && (
                        <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                          <Bot size={18} />
                        </div>
                      )}

                      <div className="space-y-3">
                        <div
                          className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            m.from === 'user'
                              ? 'gradient-primary text-white rounded-tr-none shadow-xs font-medium'
                              : 'bg-surface-hover/80 text-text-primary border border-border rounded-tl-none'
                          }`}
                        >
                          <div className="whitespace-pre-wrap">
                            {m.text.split('\n').map((line, i) => (
                              <div key={i}>
                                {line.split('**').map((part, j) =>
                                  j % 2 === 1 ? (
                                    <strong key={j} className="font-extrabold">
                                      {part}
                                    </strong>
                                  ) : (
                                    part
                                  )
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Suggested Drugs Carousel inside Bot Message */}
                        {m.drugs && m.drugs.length > 0 && (
                          <div className="p-3 bg-primary/5 border border-primary/20 rounded-2xl space-y-2">
                            <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                              <Pill size={13} />
                              Sản phẩm Dược sĩ AI đề xuất:
                            </span>
                            <div className="grid grid-cols-1 gap-2">
                              {m.drugs.map((d) => (
                                <div
                                  key={d.id}
                                  className="bg-surface p-2.5 rounded-xl border border-border flex items-center justify-between gap-3 shadow-xs"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary-lighter/40 rounded-lg border border-primary/10 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                                      {d.image ? (
                                        <img src={d.image} alt={d.name} className="w-full h-full object-contain" />
                                      ) : (
                                        <Pill size={18} className="text-primary" />
                                      )}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-text-primary text-xs">{d.name}</h4>
                                      <span className="text-[10px] text-text-muted">{d.activeIngredient || d.unit}</span>
                                      <div className="text-xs font-bold text-primary mt-0.5">{formatCurrency(d.price)}</div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleAddToCart(d)}
                                    className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors flex items-center gap-1 shadow-xs shrink-0"
                                  >
                                    <ShoppingCart size={12} />
                                    Thêm vào giỏ
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                        <Bot size={18} />
                      </div>
                      <div className="bg-surface-hover border border-border rounded-2xl rounded-tl-none px-4 py-3">
                        <TypingDots />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 sm:p-4 border-t border-border bg-surface flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Mô tả triệu chứng (sốt, đau đầu, ho, dị ứng...)"
                className="flex-1 px-4 py-3 bg-surface-hover/50 border border-border rounded-xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              <Button type="submit" variant="primary" className="px-5 py-3 rounded-xl gap-2 font-bold shrink-0">
                <Send size={15} />
                <span className="hidden sm:inline">Gửi</span>
              </Button>
            </form>
          </div>
        </Card>

        {/* Quick Suggestion Chips */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => handleSend('Tôi bị sốt cao và đau đầu')}
            className="px-3 py-1.5 bg-surface border border-border rounded-full text-xs font-semibold text-text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            💉 "Tôi bị sốt cao và đau đầu"
          </button>
          <button
            onClick={() => handleSend('Thuốc trị dị ứng mẩn ngứa')}
            className="px-3 py-1.5 bg-surface border border-border rounded-full text-xs font-semibold text-text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            🔴 "Dị ứng mẩn ngứa"
          </button>
          <button
            onClick={() => handleSend('Cảm cúm và ho hắt hơi')}
            className="px-3 py-1.5 bg-surface border border-border rounded-full text-xs font-semibold text-text-secondary hover:border-primary hover:text-primary transition-colors"
          >
            🤧 "Cảm cúm và ho"
          </button>
        </div>

      </div>
    </main>
  );
}
