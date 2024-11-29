// src/scenes/DifferentialPrivacyMinigame.js

export class DifferentialPrivacyMinigame extends Phaser.Scene {
    constructor() {
      super('DifferentialPrivacyMinigame');
    }
  
    init(data) {
      this.returnScene = data.returnScene;
      this.terminal = data.terminal;
    }
  
    create() {
      // Background overlay
      this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
  
      // Instruction
      this.add.text(400, 50, 'Answer queries while preserving privacy!', {
        fontSize: '24px',
        fill: '#FFFFFF',
      }).setOrigin(0.5);
  
      // Epsilon value
      this.epsilon = 1.0; // Privacy budget
      this.epsilonText = this.add.text(16, 16, `Epsilon: ${this.epsilon.toFixed(2)}`, {
        fontSize: '24px',
        fill: '#FFFFFF',
      });
  
      // Queries
      this.queries = [
        { question: 'What is the total number of users?', trueAnswer: 100 },
        { question: 'How many users are over 30?', trueAnswer: 40 },
      ];
      this.currentIndex = 0;
      this.showQuery();
    }
  
    showQuery() {
      if (this.currentIndex >= this.queries.length) {
        // Minigame complete
        this.minigameCompleted();
        return;
      }
  
      const query = this.queries[this.currentIndex];
  
      // Display question
      if (this.questionText) this.questionText.destroy();
      this.questionText = this.add.text(400, 200, query.question, {
        fontSize: '28px',
        fill: '#FFD700',
        wordWrap: { width: 700 },
      }).setOrigin(0.5);
  
      // Input field
      if (this.answerInput) this.answerInput.destroy();
      this.answerInput = this.add.dom(400, 300, 'input', {
        type: 'number',
        placeholder: 'Your Answer',
        fontSize: '24px',
      }).setOrigin(0.5);
  
      // Submit button
      if (this.submitButton) this.submitButton.destroy();
      this.submitButton = this.add.text(400, 350, 'Submit', {
        fontSize: '24px',
        fill: '#FFFFFF',
        backgroundColor: '#0000FF',
        padding: { x: 10, y: 5 },
      }).setInteractive().setOrigin(0.5);
  
      this.submitButton.on('pointerdown', () => {
        const userAnswer = parseFloat(this.answerInput.node.value);
        this.checkAnswer(userAnswer);
      });
    }
  
    checkAnswer(userAnswer) {
      const query = this.queries[this.currentIndex];
      const noise = this.laplaceMechanism(this.epsilon);
      const noisyAnswer = query.trueAnswer + noise;
  
      // Compare user's answer to the noisy answer
      const isClose = Math.abs(userAnswer - noisyAnswer) <= 10; // Acceptable error margin
  
      if (isClose) {
        // Correct
        this.showFeedback('Accepted!', 0x00FF00);
      } else {
        // Incorrect
        this.showFeedback('Too Far Off!', 0xFF0000);
      }
  
      // Update epsilon
      this.epsilon -= 0.2; // Decrease privacy budget
      this.epsilon = Math.max(this.epsilon, 0.1);
      this.epsilonText.setText(`Epsilon: ${this.epsilon.toFixed(2)}`);
  
      // Move to next query
      this.currentIndex++;
      this.time.delayedCall(1000, () => {
        this.showQuery();
      });
    }
  
    laplaceMechanism(epsilon) {
      // Generate noise from Laplace distribution
      const scale = 1 / epsilon;
      const u = Math.random() - 0.5;
      return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
    }
  
    showFeedback(message, color) {
      if (this.feedbackText) this.feedbackText.destroy();
      this.feedbackText = this.add.text(400, 400, message, {
        fontSize: '32px',
        fill: Phaser.Display.Color.IntegerToColor(color).rgba,
      }).setOrigin(0.5);
  
      this.time.delayedCall(500, () => {
        if (this.feedbackText) this.feedbackText.destroy();
      });
    }
  
    minigameCompleted() {
      // Display completion message
      const completeText = this.add.text(400, 300, 'Differential Privacy Applied!', {
        fontSize: '32px',
        fill: '#00FF00',
      }).setOrigin(0.5);
  
      this.time.delayedCall(2000, () => {
        // Inform the main scene that this terminal's minigame is completed
        if (this.returnScene && this.terminal) {
          this.returnScene.terminalCompleted(this.terminal);
        }
        // Return to the main scene
        this.scene.stop();
        this.scene.resume(this.returnScene.scene.key);
      });
    }
  }
  