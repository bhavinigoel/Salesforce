import { LightningElement, wire, track } from 'lwc';
import getAllObjects from '@salesforce/apex/MetadataController.getAllObjects';
import getPicklistFields from '@salesforce/apex/MetadataController.getPicklistFields';

export default class MetadataPicker extends LightningElement {

    @track objectOptions = [];
    @track fieldOptions = [];

    selectedObject;
    selectedField;

    // 🔹 Load all objects
    @wire(getAllObjects)
    wiredObjects({ data, error }) {
        if (data) {
            this.objectOptions = data.map(obj => ({
                label: obj,
                value: obj
            }));
        } else if (error) {
            console.error('Error fetching objects:', error);
        }
    }

    // 🔹 When object is selected
    handleObjectChange(event) {
        this.selectedObject = event.detail.value;
        this.selectedField = null;
        this.fieldOptions = [];

        // Call Apex to get ONLY picklist fields
        getPicklistFields({ objectName: this.selectedObject })
            .then(result => {
                this.fieldOptions = result.map(field => ({
                    label: field.label,     // user-friendly label
                    value: field.apiName    // API name
                }));
            })
            .catch(error => {
                console.error('Error fetching picklist fields:', error);
            });
    }

    // 🔹 When field is selected
    handleFieldChange(event) {
        this.selectedField = event.detail.value;
    }
}