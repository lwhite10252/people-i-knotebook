import React from 'react';

const ContactList = ({
    contacts,
    isLoading,
    loadError,
    onEdit,
    onDelete,
}) => {
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
                No contacts yet. Use "New Contact" to add the first one.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-zinc-500">
                    <tr>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Nickname</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Phone</th>
                        <th className="px-4 py-3 font-medium">Birthday</th>
                        <th className="px-4 py-3 font-medium">Notes</th>
                        <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {contacts.map(
                        (contact) => (
                            <tr key={contact?.id ?? Math.random()}>
                                <td className="px-4 py-3 font-medium text-zinc-100">
                                    {contact?.first_name ?? ''} {contact?.last_name ?? ''}
                                </td>
                                <td className="px-4 py-3 text-zinc-400">
                                    {contact?.nickname ?? ''}
                                </td>
                                <td className="px-4 py-3 text-zinc-400">
                                    {contact?.email ?? ''}
                                </td>
                                <td className="px-4 py-3 text-zinc-400">
                                    {contact?.phone ?? ''}
                                </td>
                                <td className="px-4 py-3 text-zinc-400">
                                    {contact?.birthday ?? ''}
                                </td>
                                <td className="px-4 py-3 text-zinc-400">
                                    {contact?.notes ?? ''}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(contact)}
                                            className="text-sm font-medium text-amber-400 hover:text-amber-300"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(contact.id)}
                                            className="text-sm font-medium text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ContactList;
