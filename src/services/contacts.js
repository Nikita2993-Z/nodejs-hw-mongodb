import { Contact } from "../db/models/contact.js";

export const getContacts = async () => {
    const contacts = await Contact.find();
    return contacts;
};

export const getContactById = async (studentId) => {
    const contact = await Contact.findById(studentId);
    return contact;
};