'use client';

import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  content?: string | React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
  setIsOpen: (isOpen: boolean) => void;
}

function PortalModal({
  title,
  content,
  size = 'md',
  isOpen,
  footer,
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm">
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="p-6">{content}</div>

        {/* Footer */}
        {footer}
      </div>
    </div>,
    document.getElementById('modal') as HTMLElement
  );
}

export default PortalModal;
