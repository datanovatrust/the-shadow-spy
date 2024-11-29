// src/scenes/FederatedLearningMinigame.js

export class FederatedLearningMinigame extends Phaser.Scene {
    constructor() {
      super('FederatedLearningMinigame');
    }
  
    init(data) {
      this.returnScene = data.returnScene;
      this.terminal = data.terminal;
    }
  
    create() {
      // Background overlay
      this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
  
      // Local dataset (unique per terminal)
      this.localData = this.generateLocalData(this.terminal.id);
  
      // Display instruction
      this.add.text(400, 50, 'Classify the data points correctly!', {
        fontSize: '24px',
        fill: '#FFFFFF',
      }).setOrigin(0.5);
  
      // Display data points
      this.currentIndex = 0;
      this.correctAnswers = 0;
      this.totalDataPoints = this.localData.length;
      this.showDataPoint();
    }
  
    generateLocalData(terminalId) {
      // Generate unique data for each terminal
      const dataSets = {
        1: [
          { input: 'Image of a cat', label: 'Cat' },
          { input: 'Image of a dog', label: 'Dog' },
        ],
        2: [
          { input: 'Sound of a piano', label: 'Piano' },
          { input: 'Sound of a guitar', label: 'Guitar' },
        ],
        3: [
          { input: 'Text: "Hello, world!"', label: 'Greeting' },
          { input: 'Text: "Goodbye!"', label: 'Farewell' },
        ],
      };
      return dataSets[terminalId];
    }
  
    showDataPoint() {
      if (this.currentIndex >= this.localData.length) {
        // Local training complete
        this.minigameCompleted();
        return;
      }
  
      const dataPoint = this.localData[this.currentIndex];
  
      // Display data input
      if (this.dataText) this.dataText.destroy();
      this.dataText = this.add.text(400, 200, dataPoint.input, {
        fontSize: '32px',
        fill: '#FFD700',
        wordWrap: { width: 700 },
      }).setOrigin(0.5);
  
      // Display options
      const options = ['Cat', 'Dog', 'Piano', 'Guitar', 'Greeting', 'Farewell'];
      this.optionButtons = [];
  
      options.forEach((option, index) => {
        const button = this.add.text(200 + (index % 3) * 200, 400 + Math.floor(index / 3) * 50, option, {
          fontSize: '24px',
          fill: '#FFFFFF',
          backgroundColor: '#0000FF',
          padding: { x: 10, y: 5 },
        }).setInteractive();
  
        button.on('pointerdown', () => {
          this.checkAnswer(option);
        });
  
        this.optionButtons.push(button);
      });
    }
  
    checkAnswer(selectedOption) {
      const dataPoint = this.localData[this.currentIndex];
      if (selectedOption === dataPoint.label) {
        this.correctAnswers++;
        // Feedback
        this.showFeedback('Correct!', 0x00FF00);
      } else {
        // Feedback
        this.showFeedback('Incorrect!', 0xFF0000);
      }
  
      // Move to next data point
      this.currentIndex++;
      this.time.delayedCall(1000, () => {
        this.showDataPoint();
      });
    }
  
    showFeedback(message, color) {
      if (this.feedbackText) this.feedbackText.destroy();
      this.feedbackText = this.add.text(400, 300, message, {
        fontSize: '32px',
        fill: Phaser.Display.Color.IntegerToColor(color).rgba,
      }).setOrigin(0.5);
  
      this.time.delayedCall(500, () => {
        if (this.feedbackText) this.feedbackText.destroy();
      });
    }
  
    minigameCompleted() {
      // Calculate local update (simulated)
      const localUpdate = this.correctAnswers / this.totalDataPoints;
  
      // Store the local update in the terminal
      this.terminal.localUpdate = localUpdate;
  
      // Display completion message
      const completeText = this.add.text(400, 300, 'Local Training Complete!', {
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
  