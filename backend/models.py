from config import db

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    first_name = db.Column(db.String(50), unique = False, nullable = False)
    last_name = db.Column(db.String(50), unique = False, nullable = False)
    nickname = db.Column(db.String(50), unique = False, nullable = True)
    email = db.Column(db.String(100), unique = True, nullable = True)
    phone = db.Column(db.String(20), unique = True, nullable = True)
    birthday = db.Column(db.String(10), unique = False, nullable = True)
    notes = db.Column(db.String(240), unique = False, nullable = True)

    def to_json(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'nickname': self.nickname,
            'email': self.email,
            'phone': self.phone,
            'birthday': self.birthday,
            'notes': self.notes,
        }
    