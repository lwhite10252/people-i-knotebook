import React from "react";

function ContactModal({ isOpen, onClose, children }) {
if (! isOpen) {
    return null;
}

return (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        onClick={onClose}
    >
        <div
            className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
        >
            {children}
        </div>
    </div>
);
}

export default ContactModal;
