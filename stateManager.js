// stateManager.js
class StateManager {
    constructor() {
        this.history = [];
        this.currentIndex = -1;
    }

    captureState(stateData) {
        // Remove future states if we're not at the end
        this.history = this.history.slice(0, this.currentIndex + 1);

        // Add new state
        this.history.push(JSON.parse(JSON.stringify(stateData)));
        this.currentIndex = this.history.length - 1;
    }

    getCurrentState() {
        return this.history[this.currentIndex];
    }

    undo() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.getCurrentState();
        }
        return null;
    }

    redo() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            return this.getCurrentState();
        }
        return null;
    }

    reset() {
        this.history = [];
        this.currentIndex = -1;
    }
}

// Global state manager instance
const stateManager = new StateManager();