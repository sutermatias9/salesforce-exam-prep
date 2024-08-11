import { LightningElement, api } from 'lwc';

export default class ExamDetails extends LightningElement {
    @api exam;

    handleBackClick() {
        this.fireEvent('back', null);
    }

    fireEvent(name, detail) {
        this.dispatchEvent(new CustomEvent(name, { detail }));
    }
}
