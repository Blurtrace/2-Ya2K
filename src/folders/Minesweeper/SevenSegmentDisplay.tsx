'use client';

import React from 'react';

type SevenSegmentDisplayProps = {
  value: number;
};

// Segment configuration for digits 0-9 and minus sign
const SEGMENTS: Record<string, number[]> = {
  '0': [1, 1, 1, 1, 1, 1, 0], // a,b,c,d,e,f,g
  '1': [0, 1, 1, 0, 0, 0, 0],
  '2': [1, 1, 0, 1, 1, 0, 1],
  '3': [1, 1, 1, 1, 0, 0, 1],
  '4': [0, 1, 1, 0, 0, 1, 1],
  '5': [1, 0, 1, 1, 0, 1, 1],
  '6': [1, 0, 1, 1, 1, 1, 1],
  '7': [1, 1, 1, 0, 0, 0, 0],
  '8': [1, 1, 1, 1, 1, 1, 1],
  '9': [1, 1, 1, 1, 0, 1, 1],
  '-': [0, 0, 0, 0, 0, 0, 1],
  ' ': [0, 0, 0, 0, 0, 0, 0],
};

const Digit = ({ char }: { char: string }) => {
  const active = SEGMENTS[char] || SEGMENTS[' '];

  return (
    <svg
      viewBox="0 0 13 23"
      className="w-[13px] h-[23px] flex-shrink-0"
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* a: top */}
      <polygon
        points="2,1 10,1 9,3 3,3"
        fill={active[0] ? '#FF0000' : '#400000'}
      />
      {/* b: top-right */}
      <polygon
        points="10,2 12,3 11,10 9,9"
        fill={active[1] ? '#FF0000' : '#400000'}
      />
      {/* c: bottom-right */}
      <polygon
        points="11,11 12,18 10,19 9,12"
        fill={active[2] ? '#FF0000' : '#400000'}
      />
      {/* d: bottom */}
      <polygon
        points="3,18 9,18 10,20 2,20"
        fill={active[3] ? '#FF0000' : '#400000'}
      />
      {/* e: bottom-left */}
      <polygon
        points="2,11 3,12 1,19 0,18"
        fill={active[4] ? '#FF0000' : '#400000'}
      />
      {/* f: top-left */}
      <polygon
        points="2,2 3,3 1,10 0,9"
        fill={active[5] ? '#FF0000' : '#400000'}
      />
      {/* g: middle */}
      <polygon
        points="3,10 9,10 10,11 9,12 3,12 2,11"
        fill={active[6] ? '#FF0000' : '#400000'}
      />
    </svg>
  );
};

export const SevenSegmentDisplay = ({ value }: SevenSegmentDisplayProps) => {
  // Clamp between -99 and 999
  const clamped = Math.max(-99, Math.min(999, value));
  let formatted: string;

  if (clamped < 0) {
    formatted = '-' + String(Math.abs(clamped)).padStart(2, '0');
  } else {
    formatted = String(clamped).padStart(3, '0');
  }

  const chars = formatted.slice(-3).split('');

  return (
    <div
      className="bg-black p-[2px] flex items-center gap-[2px] border border-[#808080] border-t-[#000000] border-l-[#000000] border-r-white border-b-white select-none"
      style={{
        boxShadow: 'inset 1px 1px 0px #000',
      }}
    >
      {chars.map((char, i) => (
        <Digit key={i} char={char} />
      ))}
    </div>
  );
};
