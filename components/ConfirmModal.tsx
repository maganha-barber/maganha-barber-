"use client";

import { X, AlertCircle, CheckCircle, Trash2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "success" | "info";
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning",
  loading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: <Trash2 className="h-6 w-6 text-red-600" />,
      button: "bg-red-600 hover:bg-red-700 text-white",
      iconBg: "bg-red-100",
    },
    warning: {
      icon: <AlertCircle className="h-6 w-6 text-amber-600" />,
      button: "bg-amber-600 hover:bg-amber-700 text-white",
      iconBg: "bg-amber-100",
    },
    success: {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      button: "bg-green-600 hover:bg-green-700 text-white",
      iconBg: "bg-green-100",
    },
    info: {
      icon: <AlertCircle className="h-6 w-6 text-blue-600" />,
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      iconBg: "bg-blue-100",
    },
  };

  const styles = typeStyles[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4">
          <div className={`${styles.iconBg} rounded-full p-3 flex-shrink-0`}>
            {styles.icon}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">
              {title}
            </h3>
            <p className="text-neutral-600 text-sm mb-6">
              {message}
            </p>
            
            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-neutral-300 rounded-md font-medium text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.button}`}
              >
                {loading ? "Processando..." : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
