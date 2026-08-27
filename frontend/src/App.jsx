import { useState, useEffect, useCallback, useMemo } from 'react';
import ContactList from './ContactList';
import ContactForm from './ContactForm';
import ContactModal from './components/ContactModal';
import Toast from './components/Toast';

const API_BASE_URL = 'http://127.0.0.1:5000';

function App() {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState(null);

    const fetchContacts = useCallback(async () => {
        setIsLoading(true);
        setLoadError('');
        try {
            const response = await fetch(`${API_BASE_URL}/contacts`);
            if (! response.ok) {
                throw new Error('Unexpected response from server.');
            }
            const data = await response.json();
            setContacts(Array.isArray(data?.contacts) ? data.contacts : []);
        } catch (error) {
            setLoadError('Could not load contacts. Is the Flask backend running on port 5000?');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const openCreateModal = () => {
        setEditingContact(null);
        setIsModalOpen(true);
    };

    const openEditModal = (contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingContact(null);
    };

    const handleContactSaved = () => {
        const wasEditing = Boolean(editingContact);
        closeModal();
        fetchContacts();
        setToast({ message: wasEditing ? 'Contact updated.' : 'Contact added.' });
    };
        const term = searchTerm.trim().toLowerCase();
        if (! term) return true;
        
        const haystack = [
            contact?.first_name,
            contact?.last_name,
            contact?.nickname,
            contact?.email,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return haystack.includes(term);
    });

    const handleDownloadCsv = () => {
        const headers = [
            'First Name', 
            'Last Name', 
            'Nickname', 
            'Email', 
            'Phone', 
            'Birthday', 
            'Notes'
        ];
        const escapeCsvValue = (value) => {
            const stringValue = value === undefined || value === null ? '' : String(value);
            if (/[",\n]/.test(stringValue)) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };
        const rows = filteredContacts.map((contact) => [
            contact?.first_name,
            contact?.last_name,
            contact?.nickname,
            contact?.email,
            contact?.phone,
            contact?.birthday,
            contact?.notes,
        ].map(escapeCsvValue).join(','));
        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'contacts.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDelete = async (contactId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/delete_contact/${contactId}`, {
                method: 'DELETE',
            });
            if (! response.ok) {
                throw new Error('Delete request failed.');
            }
            fetchContacts();
            setToast({ message: 'Contact deleted.', tone: 'danger' });
        } catch (error) {
            setToast({ message: 'Could not delete that contact. Please try again.', tone: 'danger' });
        }
    };

    const contactCountLabel = searchTerm.trim()
        ? `${sortedContacts.length} of ${contacts.length} contacts`
        : `${contacts.length} contact${contacts.length === 1 ? '' : 's'}`;

    return (
        <div className="min-h-screen bg-zinc-950 py-10 px-4">
            <div className="mx-auto max-w-5xl space-y-6">
                <header className="flex flex-wrap items-end justify-between gap-4 mb-12">
                    <div>
                        <p className="text-sm font-medium uppercase leading-none tracking-[0.2em] text-zinc-500">
                            People I
                        </p>
                        <h1 className="-mt-1 font-display text-6xl font-semibold leading-none text-zinc-50">
                            Knotebook
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            A contacts manager. You're sooo popular.
                        </p>
                    </div>
                </header>

                <section>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-baseline gap-3">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                                Contacts
                            </h2>
                            <span className="text-xs text-zinc-600">{contactCountLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search contacts"
                                    className="w-64 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 pr-8 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm('')}
                                        aria-label="Clear search"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                            >
                                New Contact
                            </button>
                        </div>
                    </div>
                    <ContactList
                        contacts={filteredContacts}
                        isLoading={isLoading}
                        loadError={loadError}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                    <div className="mt-3 text-right">
                        <button
                            type="button"
                            onClick={handleDownloadCsv}
                            disabled={contacts.length === 0}
                            className="text-xs text-zinc-300 hover:text-zinc-50"
                        >
                            Download CSV
                        </button>
                    </div>
                </section>
            </div>

            <ContactModal isOpen={isModalOpen} onClose={closeModal}>
                <ContactForm
                    existingContact={editingContact || {}}
                    onSaved={handleContactSaved}
                    onCancel={closeModal}
                />
            </ContactModal>

            {toast && (
                <Toast
                    message={toast.message}
                    tone={toast.tone}
                    onDismiss={() => setToast(null)}
                />
            )}
        </div>
    );
}

export default App;
