import { useState } from 'react';

const API_BASE_URL = 'http://127.0.0.1:5000';

const ContactForm = ({
    existingContact = {},
    onSaved,
}) => {
    const [firstName, setFirstName] = useState(existingContact.first_name || '');
    const [lastName, setLastName] = useState(existingContact.last_name || '');
    const [nickname, setNickname] = useState(existingContact.nickname || '');
    const [email, setEmail] = useState(existingContact.email || '');
    const [phone, setPhone] = useState(existingContact.phone || '');
    const [birthday, setBirthday] = useState(existingContact.birthday || '');
    const [notes, setNotes] = useState(existingContact.notes || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState([]);

    const updating = Object.entries(existingContact).length !== 0;

    const getValidationErrors = () => {
        const errors = [];
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phone.trim();

        if (! updating && (! trimmedFirstName || ! trimmedLastName)) {
            errors.push('First name and last name are required.');
        }
        if (trimmedFirstName && (trimmedFirstName.length < 2 || trimmedFirstName.length > 50)) {
            errors.push('First name must be between 2 and 50 characters.');
        }
        if (trimmedLastName && (trimmedLastName.length < 2 || trimmedLastName.length > 50)) {
            errors.push('Last name must be between 2 and 50 characters.');
        }
        if (! updating && ! trimmedEmail && ! trimmedPhone) {
            errors.push('Either email or phone is required.');
        }
        if (birthday) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const chosenBirthday = new Date(birthday + 'T00:00:00');
            if (chosenBirthday > today) {
                errors.push('Birthday cannot be in the future.');
            }
        }

        return errors;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setFormErrors([]);

        const clientErrors = getValidationErrors();
        
        if (clientErrors.length > 0) {
            setFormErrors(clientErrors);
            return;
        }

        const payload = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            nickname: nickname.trim(),
            email: email.trim(),
            phone: phone.trim(),
            birthday: birthday || null,
            notes: notes.trim(),
        };

        const url = updating
            ? `${API_BASE_URL}/update_contact/${existingContact.id}`
            : `${API_BASE_URL}/create_contact`;

        const options = {
            method: updating ? 'PATCH' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        };

        setIsSubmitting(true);
        try {
            const response = await fetch(url, options);
            const data = await response.json().catch(() => null);

            if (! response.ok) {
                setFormErrors(data?.errors?.length 
                    ? data.errors 
                    : [data?.message ?? 'Something went wrong. Please try again.']
                );
                
                return;
            }

            onSaved();
        } catch (error) {
            setFormErrors(['Could not reach the server.']);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-100">
                {updating ? 'Edit Contact' : 'New Contact'}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-zinc-300">
                        First name *
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-zinc-300">
                        Last name *
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <div>
                    <label htmlFor="nickname" className="mb-1 block text-sm font-medium text-zinc-300">
                        Nickname
                    </label>
                    <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <div>
                    <label htmlFor="birthday" className="mb-1 block text-sm font-medium text-zinc-300">
                        Birthday 
                    </label>
                    <input
                        type="date"
                        id="birthday"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-zinc-300">
                        Email 
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="mb-1 block text-sm font-medium text-zinc-300">
                        Phone 
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="notes" className="mb-1 block text-sm font-medium text-zinc-300">
                    Notes 
                </label>
                <textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
            </div>

            {formErrors.length > 0 && (
                <ul className="space-y-1 rounded-lg border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-400">
                    {formErrors.map((error) => (
                        <li key={error}>{error}</li>
                    ))}
                </ul>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? 'Saving...' : updating ? 'Save changes' : 'Create contact'}
            </button>
        </form>
    );
};

export default ContactForm;
