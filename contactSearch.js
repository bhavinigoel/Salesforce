import { LightningElement, track } from 'lwc';
import searchContacts from '@salesforce/apex/ContactController.searchContacts';
import updateContact from '@salesforce/apex/ContactController.updateContact';
import deleteContact from '@salesforce/apex/ContactController.deleteContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ContactSearch extends LightningElement {

    firstName = '';
    lastName = '';
    email = '';

    @track contacts = [];
    @track showModal = false;
    @track editRecord = {};

    columns = [
        { label: 'First Name', fieldName: 'FirstName' },
        { label: 'Last Name', fieldName: 'LastName' },
        { label: 'Email', fieldName: 'Email' },
        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    { label: 'Edit', name: 'edit' },
                    { label: 'Delete', name: 'delete' }
                ]
            }
        }
    ];

    handleInput(event) {
        const label = event.target.label;

        if (label === 'First Name') this.firstName = event.target.value;
        if (label === 'Last Name') this.lastName = event.target.value;
        if (label === 'Email') this.email = event.target.value;
    }

    handleSearch() {
        searchContacts({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email
        })
        .then(result => {
            this.contacts = result;
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
        });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        if (actionName === 'edit') {
            this.editRecord = { ...row };
            this.showModal = true;
        } else if (actionName === 'delete') {
            this.deleteContact(row.Id);
        }
    }

    handleEdit(event) {
        const label = event.target.label;

        if (label === 'First Name') this.editRecord.FirstName = event.target.value;
        if (label === 'Last Name') this.editRecord.LastName = event.target.value;
        if (label === 'Email') this.editRecord.Email = event.target.value;
    }

    saveContact() {
        updateContact({ con: this.editRecord })
        .then(() => {
            this.showToast('Success', 'Contact updated', 'success');
            this.showModal = false;
            this.handleSearch(); // 🔥 refresh data
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
        });
    }

    deleteContact(contactId) {
        deleteContact({ contactId })
        .then(() => {
            this.showToast('Success', 'Contact deleted', 'success');
            this.handleSearch(); // 🔥 refresh data
        })
        .catch(error => {
            this.showToast('Error', error.body.message, 'error');
        });
    }

    closeModal() {
        this.showModal = false;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }
}