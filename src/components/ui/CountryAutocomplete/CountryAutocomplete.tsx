'use client';

import { useState, useRef, useEffect } from 'react';
import { searchCountries } from '@/data/countries';
import styles from './CountryAutocomplete.module.css';

export interface CountryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  fullWidth?: boolean;
  name?: string;
}

export function CountryAutocomplete({
  value,
  onChange,
  onBlur,
  placeholder = 'Ej: Madrid, España',
  label,
  error,
  required = false,
  fullWidth = false,
  name,
}: CountryAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Buscar sugerencias cuando cambia el valor
  useEffect(() => {
    if (value && value.length >= 2) {
      const results = searchCountries(value, 3);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setFocusedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[focusedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay para permitir que el clic en la sugerencia se procese
    setTimeout(() => {
      setShowSuggestions(false);
      onBlur?.();
    }, 200);
  };

  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={`${styles.input} ${error ? styles.error : ''}`}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
        />
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className={styles.suggestions}
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                className={`${styles.suggestionItem} ${
                  index === focusedIndex ? styles.focused : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                role="option"
                aria-selected={index === focusedIndex}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}




