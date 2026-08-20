from flask import request, jsonify
from config import app, db
from models import Contact
from validation import validate_contact

# Create
@app.route('/create_contact', methods=['POST'])
def create_contact():
    payload = request.json or {}
    is_valid, errors, cleaned = validate_contact(payload, required = True)

    if not is_valid or errors:
        return (
            jsonify({
                'message': 'Validation failed', 
                'errors': errors,
            }), 400
        )

    new_contact = Contact(
        first_name = cleaned['first_name'],
        last_name = cleaned['last_name'],
        nickname = cleaned['nickname'],
        email = cleaned['email'],
        phone = cleaned['phone'],
        birthday = cleaned['birthday'].isoformat() if cleaned['birthday'] else None,
        notes = cleaned['notes'],
    )
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return (
            jsonify({
                'message': str(e)
            }), 400
        )

    return jsonify({
        'message': 'Successfully created contact!'
    }), 201

# Read
@app.route('/contacts', methods=['GET'])
def get_contacts():
    contacts = Contact.query.order_by(Contact.first_name.asc()).all()
    json_contacts = list(map(lambda x: x.to_json(), contacts))

    return jsonify({
        'contacts': json_contacts
    })

# Update
@app.route('/update_contact/<int:user_id>', methods=['PATCH'])
def update_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return (
            jsonify({
                'message': 'Contact not found'
            }), 404
        )

    data = request.json or {}
    is_valid, errors, cleaned = validate_contact(data, required = False)

    if not is_valid:
        return (
            jsonify({
                'message': 'Validation failed', 
                'errors': errors
            }), 400
        )

    if cleaned['first_name'] is not None:
        contact.first_name = cleaned['first_name']
    if cleaned['last_name'] is not None:
        contact.last_name = cleaned['last_name']
    if cleaned['nickname'] is not None:
        contact.nickname = cleaned['nickname']
    if cleaned['email'] is not None:
        contact.email = cleaned['email']
    if cleaned['phone'] is not None:
        contact.phone = cleaned['phone']
    if cleaned['birthday'] is not None:
        contact.birthday = cleaned['birthday'].isoformat()
    if cleaned['notes'] is not None:
        contact.notes = cleaned['notes']

    db.session.commit()

    return jsonify({
        'message': 'Successfully updated contact!'
    }), 200

# Delete.
@app.route('/delete_contact/<int:user_id>', methods=['DELETE'])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)
    
    if not contact:
        return (
            jsonify({
                'message': 'Contact not found'
            }), 404
        )

    db.session.delete(contact)
    db.session.commit()

    return jsonify({
        'message': 'Successfully deleted contact!'
    }), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug = True)