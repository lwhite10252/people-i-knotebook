import { useState, useEffect, useCallback } from 'react';
import ContactList from './ContactList';
import ContactForm from './ContactForm';
import ContactModal from './components/ContactModal';

const API_BASE_URL = 'http://127.0.0.1:5000';

function App() {
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
        closeModal();
        fetchContacts();
    };

    const filteredContacts = contacts.filter((contact) => {
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
        } catch (error) {
            alert('Could not delete that contact. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 py-10 px-4">
            <div className="mx-auto max-w-5xl space-y-6">
                <header className="flex items-center justify-between">
                    <div className="title-font leading-none">
                        <div className="text-lg font-semibold text-zinc-100">
                            People I
                        </div>
                        <div className="-mt-1 text-5xl font-bold tracking-tight text-zinc-100">
                            Knotebook
                        </div>
                    </div>
                    <p className="mr-auto self-end pl-3 font-sans text-sm text-zinc-500">
                        a contacts manager. you're sooo popular.
                    </p>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="rounded-lg bg-amber-500 mt-3 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400"
                    >
                        New Contact
                    </button>
                </header>

                <section>
                    <div className="mb-3 flex items-center justify-between gap-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                            Contacts
                        </h2>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search"
                            className="w-64 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-500"
                        />
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
                            className="text-xs text-zinc-500 hover:text-zinc-300"
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
        </div>
    );
}

export default App;
