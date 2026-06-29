import type { ReactNode } from 'react';

export const Card = ({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) => (
  <div className={`card ${className}`}>
    {title && <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>}
    {children}
  </div>
);

export const StatCard = ({ label, value, color = 'primary' }: { label: string; value: number | string; color?: string }) => (
  <div className="card">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`mt-1 text-3xl font-bold text-${color}-600`}>{value}</p>
  </div>
);

export const Badge = ({ children, variant = 'default' }: { children: ReactNode; variant?: string }) => {
  const colors: Record<string, string> = {
    default: 'bg-gray-100 text-gray-700',
    Excellent: 'bg-green-100 text-green-800',
    Good: 'bg-blue-100 text-blue-800',
    'Needs Attention': 'bg-yellow-100 text-yellow-800',
    Critical: 'bg-red-100 text-red-800',
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-gray-100 text-gray-700',
  };
  return <span className={`badge ${colors[variant] || colors.default}`}>{children}</span>;
};

export const Loading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
  </div>
);

export const Pagination = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) => (
  <div className="mt-4 flex items-center justify-center gap-2">
    <button className="btn-secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
      Prev
    </button>
    <span className="text-sm text-gray-600">
      Page {page} of {totalPages}
    </span>
    <button className="btn-secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
      Next
    </button>
  </div>
);
