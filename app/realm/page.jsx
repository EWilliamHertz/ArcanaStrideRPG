'use client';

import React from 'react';

export default function RealmPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0e1a]">
      <iframe
        src="/realm.html"
        title="Arcanastride 3D: MMORPG Realm"
        className="w-full h-full border-0 outline-none block"
        allow="autoplay; fullscreen"
      />
    </div>
  );
}
