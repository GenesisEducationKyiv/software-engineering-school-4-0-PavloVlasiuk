export class Email {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(email: Email) {
    Object.assign(this, email);
  }
}
