import { cn } from '../../utils/helpers';

/**
 * Skeleton — Placeholder loading với shimmer animation
 *
 * @param {string} shape - text | card | avatar | image | custom
 * @param {string} className - Custom dimensions / styles
 */
export default function Skeleton({ shape = 'text', className }) {
  const shapeClasses = {
    text: 'h-4 w-full rounded',
    card: 'h-64 w-full rounded-xl',
    avatar: 'h-10 w-10 rounded-full',
    image: 'h-48 w-full rounded-xl',
    custom: '',
  };

  return (
    <div
      className={cn(
        'skeleton-shimmer',
        shapeClasses[shape],
        className
      )}
      aria-hidden="true"
    />
  );
}

/**
 * DrugCardSkeleton — Skeleton cho DrugCard
 */
export function DrugCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
      <Skeleton shape="image" className="h-44" />
      <Skeleton shape="text" className="h-5 w-3/4" />
      <Skeleton shape="text" className="h-3.5 w-1/2" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton shape="text" className="h-5 w-1/3" />
        <Skeleton shape="text" className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}
