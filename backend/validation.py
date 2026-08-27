import re
from datetime import date

# Step 1: validate_contac when left blank, ready to save to the database
def validate_contact(payload: dict, required: bool = True) -> list[str]:
    errors = []
    cleaned = {}

    # Names (required)
    first_name_raw = (payload.get('firstName') or '').strip()
    last_name_raw = (payload.get('lastName') or '').strip()

    if required and (not first_name_raw or not last_name_raw):
        errors.append('First name and last name are required.')
    if not required and 'firstName' in payload and not first_name_raw:
        errors.append('First name is required.')
    if not required and 'lastName' in payload and not last_name_raw:
        errors.append('Last name is required.')

    if first_name_raw and (len(first_name_raw) < 2 or len(first_name_raw) > 50):
        errors.append('First name must be between 2 and 50 characters.')
    if last_name_raw and (len(last_name_raw) < 2 or len(last_name_raw) > 50):
        errors.append('Last name must be between 2 and 50 characters.')

    cleaned['first_name'] = first_name_raw or None
    cleaned['last_name'] = last_name_raw or None

    # Nickname (optional)
    nickname_raw = (payload.get('nickname') or '').strip()
    cleaned['nickname'] = nickname_raw or None

    # Email and phone (requires either or)
    email_raw = (payload.get('email') or '').strip()
    phone_raw = (payload.get('phone') or '').strip()

    if required and (not email_raw and not phone_raw):
        errors.append('Either email or phone is required.')

    if email_raw:
        email_pattern = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
        if not email_pattern.match(email_raw):
            errors.append('Email is not valid.')
    cleaned['email'] = email_raw or None

    if phone_raw:
        phone_pattern = re.compile(r'^[0-9\-\+\s\(\)]{7,20}$')
        if not phone_pattern.match(phone_raw):
            errors.append('Phone number is not valid.')
    cleaned['phone'] = phone_raw or None

    # Birthday (optional)
    # Accepts either a Python date object or an ISO "YYYY-MM-DD" string, 
    # and rejects birthdays in the future
    birthday_raw = payload.get('birthday')
    if birthday_raw:
        try:
            if isinstance(birthday_raw, date):
                birthday_date = birthday_raw
            else:
                birthday_date = date.fromisoformat(birthday_raw)
            if birthday_date > date.today():
                errors.append('Birthday cannot be in the future.')
            cleaned['birthday'] = birthday_date
        except Exception:
            errors.append('Birthday must be in YYYY-MM-DD format.')
    else:
        cleaned['birthday'] = None

    # Notes (optional)
    notes_raw = (payload.get('notes') or '').strip()
    cleaned['notes'] = notes_raw or None

    return (len(errors) == 0, errors, cleaned)
