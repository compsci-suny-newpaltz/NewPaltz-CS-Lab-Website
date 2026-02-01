/**
 * Skeleton Components
 *
 * Loading placeholder components with shimmer animation.
 * Uses the site's neutral stone colors.
 */

/**
 * Base Skeleton component
 */
export const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200
      bg-[length:200%_100%] rounded ${className}`}
    style={{
      animation: 'shimmer 1.5s ease-in-out infinite',
    }}
    {...props}
  />
);

/**
 * Card skeleton with image, title, and description
 */
export const CardSkeleton = ({ className = '' }) => (
  <div className={`rounded-2xl bg-white p-6 shadow-sm border border-stone-100 ${className}`}>
    <Skeleton className="h-40 rounded-xl mb-4" />
    <Skeleton className="h-6 rounded w-3/4 mb-2" />
    <Skeleton className="h-4 rounded w-1/2 mb-4" />
    <div className="space-y-2">
      <Skeleton className="h-3 rounded w-full" />
      <Skeleton className="h-3 rounded w-5/6" />
    </div>
  </div>
);

/**
 * Horizontal card skeleton (for list items)
 */
export const ListItemSkeleton = ({ className = '' }) => (
  <div className={`flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm border border-stone-100 ${className}`}>
    <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 rounded w-1/3" />
      <Skeleton className="h-4 rounded w-2/3" />
    </div>
    <Skeleton className="w-20 h-8 rounded-lg" />
  </div>
);

/**
 * Table row skeleton
 */
export const TableRowSkeleton = ({ columns = 4 }) => (
  <tr className="border-b border-stone-100">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 rounded w-full" />
      </td>
    ))}
  </tr>
);

/**
 * Profile/Avatar skeleton
 */
export const AvatarSkeleton = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return <Skeleton className={`${sizeClasses[size]} rounded-full`} />;
};

/**
 * Text block skeleton (for paragraphs)
 */
export const TextBlockSkeleton = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-4 rounded"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      />
    ))}
  </div>
);

/**
 * Form field skeleton
 */
export const FormFieldSkeleton = ({ className = '' }) => (
  <div className={`space-y-1.5 ${className}`}>
    <Skeleton className="h-4 rounded w-24" />
    <Skeleton className="h-12 rounded-xl w-full" />
  </div>
);

/**
 * Stats card skeleton
 */
export const StatsSkeleton = ({ className = '' }) => (
  <div className={`rounded-2xl bg-white p-6 shadow-sm border border-stone-100 ${className}`}>
    <Skeleton className="h-4 rounded w-20 mb-2" />
    <Skeleton className="h-8 rounded w-16" />
  </div>
);

/**
 * Event card skeleton
 */
export const EventCardSkeleton = ({ className = '' }) => (
  <div className={`rounded-2xl bg-white overflow-hidden shadow-sm border border-stone-100 ${className}`}>
    <Skeleton className="h-48 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 rounded w-3/4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 rounded w-32" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 rounded w-24" />
      </div>
    </div>
  </div>
);

/**
 * Blog post card skeleton
 */
export const BlogCardSkeleton = ({ className = '' }) => (
  <div className={`rounded-2xl bg-gradient-to-br from-white to-stone-50 p-6 shadow-sm border border-stone-100 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <AvatarSkeleton size="sm" />
      <div className="space-y-1">
        <Skeleton className="h-4 rounded w-24" />
        <Skeleton className="h-3 rounded w-16" />
      </div>
    </div>
    <Skeleton className="h-6 rounded w-4/5 mb-3" />
    <TextBlockSkeleton lines={2} />
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
      <Skeleton className="h-8 rounded-lg w-24" />
      <Skeleton className="h-4 rounded w-16" />
    </div>
  </div>
);

/**
 * Grid of card skeletons
 */
export const CardGridSkeleton = ({ count = 6, columns = 3 }) => (
  <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`}>
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

// Add shimmer animation to global styles
const shimmerStyles = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const styleId = 'skeleton-shimmer-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = shimmerStyles;
    document.head.appendChild(style);
  }
}

export default Skeleton;
