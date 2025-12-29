// src/components/common/ModalBackdrop.tsx
import React from "react";

interface Props {
  onClose: () => void;
}

export default function ModalBackdrop({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-40 bg-black/40"
      onClick={onClose}
    />
  );
}
