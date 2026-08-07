import Button from '../ui/Button';

/**
 * EmptyState - Hiển thị khi không tìm thấy kết quả hoặc gặp lỗi
 */
export default function EmptyState({
  title = 'Không tìm thấy kết quả',
  description = 'Rất tiếc, chúng tôi không tìm thấy thuốc nào khớp với yêu cầu của bạn. Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.',
  onRetry,
  retryText = 'Thử lại',
}) {
  return (
    <div className="flex flex-col items-center text-center justify-center p-8 bg-surface border border-border rounded-xl max-w-md mx-auto my-12 animate-in fade-in duration-300">
      {/* Line-art illustration */}
      <svg
        className="w-24 h-24 text-text-secondary/30 mb-6"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        <rect x="35" y="35" width="30" height="30" rx="4" stroke="currentColor" strokeWidth="2" />
        <line x1="42" y1="45" x2="58" y2="45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="55" x2="52" y2="55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M68 68l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <h3 className="text-lg font-semibold text-text-primary mb-2 font-display">
        {title}
      </h3>
      <p className="text-sm text-text-secondary mb-6 leading-relaxed">
        {description}
      </p>

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryText}
        </Button>
      )}
    </div>
  );
}
