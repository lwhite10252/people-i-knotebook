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
        <div className="min-h-screen bg-zinc-950 py-10 px-4">
            <div className="mx-auto max-w-5xl space-y-6">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100">
                            People I Knotebook
                        </h1>
                        <p className="mt-1 text-sm text-zinc-400">a contacts manager. you're sooo popular.</p>
                    </div>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400"
                    >
                        New Contact
                    </button>
                </header>

                <section>
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                        Contacts
                    </h2>
                    <ContactList
                        contacts={contacts}
                        isLoading={isLoading}
                        loadError={loadError}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                </section>
            </div>

            <ContactModal isOpen={isModalOpen} onClose={closeModal}>
                <ContactForm
                    existingContact={editingContact || {}}
                    onSaved={handleContactSaved}
                />
            </ContactModal>
        </div>
    );
}

export default App;
