import React from 'react';

/**
 * Renders the brand name with exact spelling: C-H-I-J'-S
 * where the 's' is superscripted: CHIJ'ˢ
 */
export default function BrandName({
  withCollection = false,
  className = '',
  supClassName = '',
}) {
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap ${className}`}>
      <span>CHIJ&apos;</span>
      <sup className={`text-[0.62em] font-normal leading-none -top-[0.45em] lowercase ${supClassName}`}>
        s
      </sup>
      {withCollection && (
        <span className="ml-1 tracking-widest uppercase">COLLECTION</span>
      )}
    </span>
  );
}
