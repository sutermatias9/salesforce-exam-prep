import { LightningElement, api, track } from 'lwc';

export default class MockExam extends LightningElement {
    @api questions;
    @track questionSelected;

    _examQuestions;
    isInitialized = false;

    get examQuestions() {
        if (this.questions && !this.isInitialized) {
            this.isInitialized = true;

            this._examQuestions = this.questions.map((question, index) => {
                return {
                    index: index + 1,
                    userAnswers: { Option_A: false, Option_B: false, Option_C: false, Option_D: false, Option_E: false },
                    ...question
                };
            });

            this.questionSelected = this._examQuestions[0];
        }

        return this._examQuestions;
    }

    renderedCallback() {
        if (this.questionSelected) {
            this.updateCheckboxStates();
            this.markBoxAsSelected();
        }
    }

    handleNumberClick(event) {
        const questionIndex = Number(event.currentTarget.textContent);
        this.questionSelected = this.examQuestions.find((q) => q.index === questionIndex);

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

    markBoxAsSelected() {
        this.template.querySelectorAll('div.question-number').forEach((boxElement) => {
            boxElement.classList.remove('selected');

            if (Number(boxElement.textContent) === this.questionSelected.index) {
                boxElement.classList.add('selected');
            }
        });
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
