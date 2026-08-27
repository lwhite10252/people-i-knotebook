import { useEffect } from "react";

// Self-dismissing confirmation banner
function Toast({ message, tone = "default", onDismiss }) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3200);
        return () => clearTimeout(timer);
    }, [message, onDismiss]);

    const toneStyles = {
        default: "border-emerald-700 bg-emerald-900 text-emerald-100",
        danger: "border-rose-900 bg-rose-950 text-rose-200",
    };

    return (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-[60] flex justify-center px-4">
            <div
                role="status"
                className={`pointer-events-auto rounded-lg border px-4 py-2.5 text-sm font-medium shadow-lg ${toneStyles[tone] ?? toneStyles.default}`}
            >
                {message}
            </div>
        </div>
    );
}

export default Toast;
