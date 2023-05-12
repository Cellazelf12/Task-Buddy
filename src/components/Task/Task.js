export class Task {
    constructor(title, objectives, deadline, id) {
        this.id = id || `task-${new Date().toISOString().slice(0, 16)}-${title}`;
        this.title = title;
        this.objectives = objectives;
        this.deadline = deadline;
    }
}

export class Objective {
    constructor(objective, completed) {
        this.objective = objective;
        this.completed = completed;
    }
}
