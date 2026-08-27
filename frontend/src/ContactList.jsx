import { useState } from 'react';

const AVATAR_COLORS = [
    '#b45309', // amber-700
    '#0f766e', // teal-700
    '#be123c', // rose-700
    '#4338ca', // indigo-700
    '#15803d', // emerald-700
    '#475569', // slate-600
];

// The same name always maps to the same color so a contact
// doesn't look different between renders or after editing
function colorForContact(contact) {
    const key = `${contact?.first_name ?? ''}${contact?.last_name ?? ''}`;
    let hash = 0;
    for (let i = 0; i < key.length; i += 1) {
        hash = (hash * 31 + key.charCodeAt(i)) % AVATAR_COLORS.length;
    }

    return AVATAR_COLORS[Math.abs(hash)];
}

function initialsForContact(contact) {
    const first = contact?.first_name?.[0] ?? '';
    const last = contact?.last_name?.[0] ?? '';

    return (first + last).toUpperCase() || '?';
}

const SORTABLE_COLUMNS = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'birthday', label: 'Birthday' },
];

function SortIcon({ direction }) {
    if (! direction) {
        return (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="opacity-30" aria-hidden="true">
                <path d="M5 0L9 5H1L5 0Z" fill="currentColor" />
                <path d="M5 12L1 7H9L5 12Z" fill="currentColor" />
            </svg>
        );
    }
    return direction === 'asc' ? (
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
            <path d="M5 0L9 5H1L5 0Z" fill="currentColor" />
        </svg>
    ) : (
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
            <path d="M5 6L1 1H9L5 6Z" fill="currentColor" />
        </svg>
    );
}

const ContactList = ({
    contacts,
    isLoading,
    loadError,
    isFiltered,
    sortConfig,
    onSort,
    onEdit,
    onDelete,
}) => {
    const [confirmingId, setConfirmingId] = useState(null);

    if (isLoading) {
        return (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
                Loading contacts...
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="rounded-xl border border-red-900 bg-red-950/50 p-8 text-center text-red-400">
                {loadError}
            </div>
        );
    }

    if ((contacts?.length ?? 0) === 0) {
        return (
            <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 p-8 text-center text-zinc-400">
                {isFiltered
                    ? 'No contacts match your search.'
                    : 'No contacts yet. Use "New Contact" to add the first one.'}
            </div>
        );
    }

    const handleDeleteClick = (contactId) => {
        if (confirmingId === contactId) {
            setConfirmingId(null);
            onDelete(contactId);
        } else {
            setConfirmingId(contactId);
        }
    };

    return (
        <div className="paper-panel overflow-hidden overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-zinc-500">
                    <tr>
                        <th className="w-12 px-4 py-3" aria-hidden="true" />
                        {SORTABLE_COLUMNS.map((column) => {
                            const isActive = sortConfig?.key === column.key;
                            return (
                                <th key={column.key} className="px-4 py-3 font-medium">
                                    <button
                                        type="button"
                                        onClick={() => onSort(column.key)}
                                        className="flex items-center gap-1.5 text-zinc-500 transition hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                                    >
                                        {column.label}
                                        <span className={isActive ? 'text-amber-500' : ''}>
                                            <SortIcon direction={isActive ? sortConfig.direction : null} />
                                        </span>
                                    </button>
                                </th>
                            );
                        })}
                        <th className="px-4 py-3 font-medium">Notes</th>
                        <th className="px-4 py-3 font-medium text-right"></th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => {
                        const isConfirming = confirmingId === contact.id;
                        return (
                            <tr
                                key={contact?.id ?? Math.random()}
                                className="paper-row"
                                onMouseLeave={() => {
                                    if (isConfirming) setConfirmingId(null);
                                }}
                            >
                                <td className="px-4 py-3">
                                    <div
                                        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white"
                                        style={{ backgroundColor: colorForContact(contact) }}
                                        aria-hidden="true"
                                    >
                                        {initialsForContact(contact)}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-zinc-900">
                                    <div className="font-medium">{contact?.first_name ?? ''} {contact?.last_name ?? ''}</div>
                                    {contact?.nickname && (
                                        <div className="text-xs text-zinc-500">({contact.nickname})</div>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                    {contact?.email ?? <span className="text-zinc-400">—</span>}
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                    {contact?.phone ?? <span className="text-zinc-400">—</span>}
                                </td>
                                <td className="px-4 py-3 text-zinc-700">
                                    {contact?.birthday ?? <span className="text-zinc-400">—</span>}
                                </td>
                                <td className="max-w-64 truncate px-4 py-3 text-zinc-700">
                                    {contact?.notes ?? <span className="text-zinc-400">—</span>}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(contact)}
                                            className="text-sm font-medium text-amber-700 transition hover:text-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteClick(contact.id)}
                                            className={`rounded px-2 py-1 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                                                isConfirming
                                                    ? 'bg-rose-700 text-white hover:bg-rose-600'
                                                    : 'text-red-700 hover:text-red-600'
                                            }`}
                                        >
                                            {isConfirming ? 'Confirm?' : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ContactList;
