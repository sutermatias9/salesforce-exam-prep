import { LightningElement, api } from 'lwc';

export default class ExamDetails extends LightningElement {
    @api exam;

    handleBackClick() {
        this.fireEvent('back');
    }

    handleStartClick() {
        this.fireEvent('start');
    }

    fireEvent(name) {
        const event = new CustomEvent(name);
        this.dispatchEvent(event);
    }
}
