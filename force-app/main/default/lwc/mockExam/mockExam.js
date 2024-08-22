import { LightningElement, api, track } from 'lwc';

export default class MockExam extends LightningElement {
    @api exam;
    @api questions;
    @track questionSelected;

    showExam = true;
    isInitialized = false;
    _examQuestions;
    score;

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

    get examName() {
        return this.exam.name + ' Exam';
    }

    renderedCallback() {
        if (this.questionSelected && this.showExam) {
            this.updateCheckboxStates();

            if (!this.isInitialized) {
                this.toggleBoxSelection(true);
                this.isInitialized = true;
            }
        }
    }

    handleNumberClick(event) {
        this.toggleBoxSelection(false);

        const questionIndex = Number(event.currentTarget.textContent);
        this.questionSelected = this.examQuestions.find((q) => q.index === questionIndex);

        this.toggleBoxSelection(true);

        console.log('Question selected' + JSON.stringify(this.questionSelected));
    }

    handleOptionChange(event) {
        const optionChanged = event.currentTarget.value;
        const isChecked = event.currentTarget.checked;

        this.questionSelected.userAnswers[optionChanged] = isChecked;
    }

    handleFinishClick() {
        const numberOfQuestions = this.examQuestions.length;
        const numberOfCorrectAnswers = this.examQuestions.reduce((accumulator, question) => {
            if (this.isCorrect(question)) {
                return (accumulator += 1);
            }

            return accumulator;
        }, 0);

        this.score = (numberOfCorrectAnswers / numberOfQuestions) * 100;
        this.result = this.score >= this.exam.Passing_Score ? 'PASS' : 'FAIL';
        this.showExam = false;
    }

    isCorrect(question) {
        const userAnswers = this.getUserSelectedOptions(question);
        const correctAnswers = this.getQuestionCorrectAnswers(question);

        return userAnswers.length === correctAnswers.length && userAnswers.every((option) => correctAnswers.includes(option));
    }

    getUserSelectedOptions(question) {
        return Object.entries(question.userAnswers)
            .filter(([, checked]) => checked)
            .map(([option]) => option);
    }

    // Example: "Option A;Option D" => ['Option_A', 'Option_D']
    getQuestionCorrectAnswers(question) {
        const answers = question.Correct_Answers.split(';');
        return answers.map((str) => str.replace(' ', '_'));
    }

    toggleBoxSelection(isSelected) {
        const classList = this.questionSelectedBox.classList;

        if (isSelected) {
            classList.add('selected');
        } else {
            classList.remove('selected');
        }
    }

    updateCheckboxStates() {
        const numberOfCorrectAnswers = this.getQuestionCorrectAnswers(this.questionSelected).length;
        const numberOfOptionsSelected = this.getUserSelectedOptions(this.questionSelected).length;

        // console.log('Correct answers = ' + numberOfCorrectAnswers + JSON.stringify(this.getQuestionCorrectAnswers()));
        // console.log('Selected answers = ' + numberOfOptionsSelected + JSON.stringify(this.getUserSelectedOptions()));

        if (numberOfCorrectAnswers === numberOfOptionsSelected) {
            this.disableUncheckedOptions();
            this.questionSelectedBox.classList.add('answered');
        } else {
            this.enableAllCheckboxes();
            this.questionSelectedBox.classList.remove('answered');
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
