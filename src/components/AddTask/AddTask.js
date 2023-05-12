import { TaskContext } from "../../contexts/TaskContext/TaskContext";

import "./AddTask.css";

import { useContext, useState } from "react";

import { useTranslation } from "react-i18next";

import { Task, Objective } from "../Task/Task";
import Button from "../Button/Button";

import { addTask } from "../../services/firebase/FirebaseWorker";

import toast from "react-hot-toast";

export const AddTask = () => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [viewObjectives, setViewObjectives] = useState(false);
  const [objectives, setObjectives] = useState([]);
  const { tasks, setTasks } = useContext(TaskContext);

  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) {
      toast.error(t("provideTaskTitle"), { duration: 5000 });
      return;
    }

    if (objectives.length === 0) {
      toast.error(t("addLeastObjective"), { duration: 5000 });
      return;
    }

    const objectivesArray = objectives.map(
      (objective) => new Objective(objective.trim(), false)
    );

    const newTask = new Task(
      newTaskTitle.trim(),
      objectivesArray,
      newTaskDeadline,
    );

    addTask(newTask);

    setTasks([...tasks, newTask]);

    setNewTaskTitle("");
    setNewTaskDeadline("");
    setObjectives([]);
    setViewObjectives(false);

    toast.success(t("taskAdded"), { duration: 2000 });
  };

  const handleAddObjective = () => {
    if (!newObjective.trim()) {
      toast.error(t("objectiveFieldEmpty"), { duration: 2000 });
      return;
    }

    if (!objectives.includes(newObjective)) {
      setObjectives([...objectives, newObjective]);
      toast.success(t("objectiveAdded", { objective: newObjective }), {
        duration: 2000,
      });
      setNewObjective("");
      document.getElementById("objective").textContent = "";
    } else {
      toast.error(t("objectiveAlreadyAdded", { objective: newObjective }), {
        duration: 10000,
      });
    }
  };

  const handleRemoveObjective = (removedObjective) => {
    setObjectives(
      objectives.filter((objective) => objective !== removedObjective)
    );
    toast.success(t("objectiveRemoved", { objective: removedObjective }), {
      duration: 2000,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-lg shadow-lg bg-white dark:bg-gray-700">
      <h2 className="text-2xl font-bold mb-4">{t("addNewTask")}</h2>
      <form onSubmit={handleSubmit}>
        <label className="block overflow-auto break-words text-gray-700 font-medium mb-2 dark:text-white">
          {t("taskTitle")}
        </label>
        <input
          className="w-full rounded-md px-3 py-2 mb-4 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent dark:text-black"
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />

        <label className="block text-gray-700 font-medium mb-2 dark:text-white">
          {t("taskDeadline")}
        </label>
        <input
          className="w-full rounded-md px-3 py-2 mb-4 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent dark:text-black"
          type="datetime-local"
          value={newTaskDeadline}
          onChange={(e) => setNewTaskDeadline(e.target.value)}
          min={new Date().toISOString()}
        />

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2 dark:text-white">
            {t("taskObjectives")}
          </label>
          <div className="flex">
            <input
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="textarea"
              id="objective"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
            />
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2"
              label={t("addObjective")}
              callback={() => handleAddObjective()}
            />
            <Button
              className={`${
                !viewObjectives
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } text-white font-bold py-2 px-4 rounded ml-2`}
              label={viewObjectives ? t("hideObjectives") : t("showObjectives")}
              callback={() => setViewObjectives(!viewObjectives)}
            />
          </div>
        </div>

        {viewObjectives ? (
          <div className="mt-4 w-full max-w-md mx-auto p-4 rounded-lg shadow-xl bg-gray-200">
            <ol className="list-none pl-4">
              {objectives.length > 0 ? (
                objectives.map((objective, index) => (
                  <li
                    className="flex items-center justify-between mb-2"
                    key={index + "-div"}
                  >
                    <p className="text-lg overflow-auto break-words dark:text-black">
                      {objective}
                    </p>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                      key={index + "-remove"}
                      label={t("removeButton")}
                      callback={() => handleRemoveObjective(objective)}
                    ></Button>
                  </li>
                ))
              ) : (
                <p className="text-red-600">{t("objectiveListEmpty")}</p>
              )}
            </ol>
          </div>
        ) : null}

        <Button
          className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          label={t("addTask")}
          buttonType="submit"
        />
      </form>
    </div>
  );
};

export default AddTask;
