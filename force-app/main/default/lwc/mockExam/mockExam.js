import { LightningElement, api, track } from 'lwc';

export default class MockExam extends LightningElement {
    @api questions;
    @track questionSelected;

    _examQuestions;
    isInitialized = false;

    get examQuestions() {
        if (this.questions && !this.isInitialized) {
            this._examQuestions = this.questions.map((question, index) => {
                return {
                    index: index + 1,
                    userAnswers: { Option_A: false, Option_B: false, Option_C: false, Option_D: false, Option_E: false },
                    isAnswered: false,
                    ...question
                };
            });

            this.questionSelected = this._examQuestions[0];
        }

        return this._examQuestions;
    }

    get questionSelectedBox() {
        if (this.questionSelected) {
            return this.template.querySelector(`div[data-index="${this.questionSelected.index}"`);
        }

        return null;
    }

    renderedCallback() {
        if (this.questionSelected) {
            this.updateCheckboxStates();

            if (!this.isInitialized) {
                this.highlightSelectedBox();
                this.isInitialized = true;
            }
        }
    }

    handleNumberClick(event) {
        this.removeBoxSelection();

        const questionIndex = Number(event.currentTarget.textContent);
        this.questionSelected = this.examQuestions.find((q) => q.index === questionIndex);

        this.highlightSelectedBox();

        console.log('Question selected' + JSON.stringify(this.questionSelected));
    }

    handleOptionChange(event) {
        const optionChanged = event.currentTarget.value;
        const isChecked = event.currentTarget.checked;

        this.questionSelected.userAnswers[optionChanged] = isChecked;
    }

    getUserSelectedOptions() {
        return Object.entries(this.questionSelected.userAnswers)
            .filter(([, checked]) => checked)
            .map(([option]) => option);
    }

    // Example: "Option A;Option D" => ['Option_A', 'Option_D']
    getQuestionCorrectAnswers() {
        const answers = this.questionSelected.Correct_Answers.split(';');
        return answers.map((str) => str.replace(' ', '_'));
    }

    highlightSelectedBox() {
        this.questionSelectedBox.classList.add('selected');
    }

    removeBoxSelection() {
        this.questionSelectedBox.classList.remove('selected');
    }

    updateCheckboxStates() {
        const numberOfCorrectAnswers = this.getQuestionCorrectAnswers().length;
        const numberOfOptionsSelected = this.getUserSelectedOptions().length;

        console.log('Correct answers = ' + numberOfCorrectAnswers + JSON.stringify(this.getQuestionCorrectAnswers()));
        console.log('Selected answers = ' + numberOfOptionsSelected + JSON.stringify(this.getUserSelectedOptions()));

        if (numberOfCorrectAnswers === numberOfOptionsSelected) {
            this.disableUncheckedOptions();
        } else {
            this.enableAllCheckboxes();
        }
    }

    enableAllCheckboxes() {
        this.template.querySelectorAll('lightning-input').forEach((checkbox) => {
            checkbox.disabled = false;
        });
    }

    disableUncheckedOptions() {
        this.template.querySelectorAll('lightning-input').forEach((checkbox) => {
            checkbox.disabled = !checkbox.checked;
        });
    }
}
