import React from 'react';

export default function Breadcrumbs({ items, onNavigate }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-surface border-b border-border py-2.5 px-4 sm:px-6 lg:px-8 transition-colors duration-150">
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-1.5 text-xs text-text-muted">
          <li>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('/');
              }}
              className="hover:text-text transition-colors font-medium"
            >
              Home
            </a>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.label} className="flex items-center space-x-1.5">
                <span className="text-text-muted" aria-hidden="true">/</span>
                {isLast ? (
                  <span className="font-bold text-text" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) onNavigate(item.path);
                    }}
                    className="hover:text-text transition-colors font-medium"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}