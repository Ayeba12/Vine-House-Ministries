'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** An underline search field with a magnifier at the left and a clear control once there is text. */
export function SearchField({ id, label, value, onChange, placeholder, className = '' }: SearchFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
        <input
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="field pl-7 pr-8"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-ink-muted transition-colors hover:text-ink"
            aria-label={`Clear ${label.toLowerCase()}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
