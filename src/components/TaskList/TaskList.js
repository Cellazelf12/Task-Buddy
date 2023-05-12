import "./TaskList.css";

import React, {
  useContext,
  useState,
  useCallback,
  useMemo
} from "react";

import { useInterval } from 'react-use';
import { useTranslation } from "react-i18next";
import Modal from "../Modal/Modal";
import { TaskContext } from "../../contexts/TaskContext/TaskContext";
import { Objective } from "../Task/Task";
import Button from "../Button/Button";
import { AddTask } from "../AddTask/AddTask";
import toast from "react-hot-toast";
import { deleteTaskOnDoc, loadTasks } from "../../services/firebase/FirebaseWorker";

const TaskList = () => {
  const { tasks, setTasks } = useContext(TaskContext);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [viewObjectives, setViewObjectives] = useState(false);
  const [objectives, setObjectives] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTask, setEditedTask] = useState();

  const { t } = useTranslation();

  loadTasks(setTasks);

  const classToRemove = useMemo(
    () => "line-through text-gray-400 dark:text-green-400",
    []
  );

  const deleteTask = useCallback(
    (task, completed) => {
      if (completed) {
        toast.success(t("taskCompleted", { title: task.title }), {
          duration: 2000,
        });
      } else {
        toast.error(t("taskNoCompleted", { title: task.title }), {
          duration: 2000,
        });
      }

      deleteTaskOnDoc(task);

      const updatedTasks = tasks.filter(
        (taskParam) => taskParam.id !== task.id
      );

      setTasks(updatedTasks);
    },
    [tasks, setTasks, t]
  );

  const checkTrigger = useCallback(
    (checkbox, task, objective) => {
      objective.completed = checkbox.checked;

      const label = document.getElementById("label-" + objective.objective);

      checkbox.checked
        ? (label.className = classToRemove)
        : (label.className = "");

      const allChecked = Object.values(task.objectives).every(
        (obj) => obj.completed === true
      );

      if (allChecked) {
        deleteTask(task, true);
      }
    },
    [classToRemove, deleteTask]
  );

  const handleEditTask = useCallback((task) => {
    setEditedTask(task);
    const arrayObjectives = task.objectives.map(
      (objective) => objective.objective
    );
    setObjectives(arrayObjectives);
    setShowEditModal(true);
  }, []);

  const updateTask = useCallback(
    (taskId, updatedTask) => {
      return new Promise((resolve, reject) => {
        const updatedTasks = tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              ...updatedTask,
            };
          } else {
            return task;
          }
        });
        setTasks(updatedTasks);
        resolve();
      });
    },
    [tasks, setTasks]
  );

  const handleSaveTask = useCallback(
    (e, updatedTask) => {
      e.preventDefault();

      const objectivesArray = objectives.map(
        (objective) => new Objective(objective.trim(), false)
      );

      if (objectivesArray.length < 1) {
        toast.error(t("addLeastObjective"), { duration: 2000 });
        return;
      }

      updateTask(updatedTask.id, {
        title: newTaskTitle.trim() === "" ? updatedTask.title : newTaskTitle,
        deadline: newTaskDeadline,
        objectives: objectivesArray,
      })
        .then(() => {
          setShowEditModal(false);
          toast.success(t("taskUpdated"));
        })
        .catch(() => {
          toast.error(t("taskUpdatingError"));
        });
    },
    [newTaskDeadline, newTaskTitle, objectives, updateTask, t]
  );

  const handleAddObjective = useCallback(() => {
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
  }, [newObjective, objectives, t]);

  const handleRemoveObjective = useCallback(
    (removedObjective) => {
      setObjectives(
        objectives.filter((objective) => objective !== removedObjective)
      );
      toast.success(t("objectiveRemoved", { objective: removedObjective }), {
        duration: 2000,
      });
    },
    [objectives, t]
  );

  const checkDate = () => {
    tasks.map((task) => {
      if (!task.deadline) {
        return false;
      }

      if (new Date(task.deadline) <= Date.now()) {
        const allChecked = Object.values(task.objectives).every(
          (obj) => obj.completed === true
        );

        deleteTask(task, allChecked);
      }

      return true;
    });
  };

  useInterval(() => {
    checkDate();
  }, 1000);

  return (
    <div className="container mx-auto py-8 sm:px-6 lg:px-8 dark:bg-gray-900 dark:text-white">
      <div className="flex space-x-4">
        <div className="flex-1 w-1/4">
          {!showEditModal ? (
            <AddTask />
          ) : (
            editedTask && (
              <Modal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
              >
                <form onSubmit={(event) => handleSaveTask(event, editedTask)}>
                  <label className="block text-gray-700 font-medium mb-2 dark:text-white">
                    {t("taskTitle")}
                  </label>
                  <input
                    className="w-full rounded-md px-3 py-2 mb-4 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent dark:text-black"
                    type="text"
                    defaultValue={editedTask.title}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />

                  <label className="block text-gray-700 font-medium mb-2 dark:text-white">
                    {t("taskDeadline")}
                  </label>
                  <input
                    className="w-full rounded-md px-3 py-2 mb-4 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent dark:text-black"
                    type="datetime-local"
                    defaultValue={editedTask.deadline}
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
                        className={`${!viewObjectives
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                          } text-white font-bold py-2 px-4 rounded ml-2`}
                        label={
                          viewObjectives
                            ? t("hideObjectives")
                            : t("showObjectives")
                        }
                        callback={() => setViewObjectives(!viewObjectives)}
                      />
                    </div>
                  </div>

                  <div
                    className="mt-4 w-full max-w-md mx-auto p-4 rounded-lg shadow-xl bg-gray-200"
                    style={{ display: viewObjectives ? "block" : "none" }}
                  >
                    <ol className="list-none pl-4">
                      {objectives.map((objective, index) => (
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
                      ))}
                    </ol>
                  </div>

                  <Button
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    label={t("editTask")}
                    buttonType="submit"
                  />
                </form>
              </Modal>
            )
          )}
        </div>
        <div className="flex-1 w-3/4 h-auto max-h-full">
          <div>
            {tasks.length === 0 ? (
              <div className="p-4 bg-white rounded-lg shadow-xl">
                <p className="text-red-600">{t("taskListEmpty")}</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5 w-4/5 m-[40px] content-start space-x-4 space-y-4">
                {tasks.map((task) => (
                  <div
                    className="grow basis-[100px] self-end max-w-[100%] p-5 bg-white rounded-lg shadow-lg dark:bg-gray-600"
                    key={task.id}
                  >
                    <div className="flex items-center">
                      <h1 className="text-md font-medium overflow-auto break-words mb-2 text-gray-900 mr-4 dark:text-white">
                        {task.title}
                      </h1>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-1 rounded text-sm whitespace-nowrap"
                        label={t("editTask")}
                        callback={() => handleEditTask(task)}
                      />
                    </div>
                    {task.deadline ? (
                      <p className="text-gray-600 truncate hover:text-clip mb-2 dark:text-white">
                        {t("taskDeadline")}
                        {new Intl.DateTimeFormat(navigator.language, {
                          dateStyle: "full",
                          timeStyle: "medium",
                        }).format(new Date(task.deadline))}
                      </p>
                    ) : null}

                    <ol className="list-none mt-4" key={task.id + "-list"}>
                      {task.objectives.map((objective) => (
                        <li
                          className="flex items-center text-gray-600 mb-1 dark:text-white"
                          key={objective.objective + "-field"}
                        >
                          <label
                            className="overflow-auto break-words"
                            id={"label-" + objective.objective}
                          >
                            {objective.objective}
                            <input
                              className="ml-2 form-checkbox h-3 w-4 accent-emerald-500/25"
                              type="checkbox"
                              id={task.id + objective.objective}
                              onChange={(e) =>
                                checkTrigger(e.target, task, objective)
                              }
                            />
                          </label>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
