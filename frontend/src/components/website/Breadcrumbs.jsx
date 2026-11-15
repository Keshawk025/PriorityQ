import React from 'react';

export default function Breadcrumbs({ items, onNavigate }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-[#F3F6FA] dark:bg-[#0B132B] border-b border-[#DCE4EE] dark:border-[#26354D] py-2.5 px-4 sm:px-6 lg:px-8 transition-colors duration-150">
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
          <li>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate('/');
              }}
              className="hover:text-[#3678D4] dark:hover:text-[#60A5FA] transition-colors font-medium"
            >
              Home
            </a>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.label} className="flex items-center space-x-1.5">
                <span className="text-[#94A3B8] dark:text-[#64748B]" aria-hidden="true">/</span>
                {isLast ? (
                  <span className="font-bold text-[#173B67] dark:text-[#F8FAFC]" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onNavigate) onNavigate(item.path);
                    }}
                    className="hover:text-[#3678D4] dark:hover:text-[#60A5FA] transition-colors font-medium"
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
