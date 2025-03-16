import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, Trash2, GripHorizontal } from "lucide-react";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState({
    todo: [
      { id: "task1", content: "Learn new sign language lesson" },
      { id: "task2", content: "Review class notes with visual aids" }
    ],
    inProgress: [
      { id: "task3", content: "Attend live video lesson" },
      { id: "task4", content: "Work on visual learning project" }
    ],
    completed: [
      { id: "task5", content: "Complete vocabulary quiz" }
    ]
  });

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newTasks = { ...tasks };
    const [movedTask] = newTasks[source.droppableId].splice(source.index, 1);
    newTasks[destination.droppableId].splice(destination.index, 0, movedTask);
    setTasks(newTasks);
  };

  const addTaskToColumn = (column) => {
    const newTask = prompt(`Enter a new task for the ${column} column:`);
    if (newTask) {
      const newTaskObj = { 
        id: `task-${Date.now()}`, 
        content: newTask 
      };
      setTasks(prev => ({
        ...prev,
        [column]: [...prev[column], newTaskObj]
      }));
    }
  };

  const removeTask = (taskId, column) => {
    setTasks(prev => ({
      ...prev,
      [column]: prev[column].filter(task => task.id !== taskId)
    }));
  };

  const columnConfig = {
    todo: { 
      title: "To Do", 
      headerColor: "bg-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200"
    },
    inProgress: { 
      title: "In Progress", 
      headerColor: "bg-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    completed: { 
      title: "Completed", 
      headerColor: "bg-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Educational Tasks</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(columnConfig).map(([columnKey, config]) => (
            <div 
              key={columnKey} 
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 flex flex-col"
            >
              <div className={`${config.headerColor} px-6 py-4`}>
                <h2 className="text-white font-bold text-lg">
                  {config.title}
                  <span className="ml-2 text-sm font-normal opacity-80">
                    ({tasks[columnKey].length})
                  </span>
                </h2>
              </div>
              
              <div className="flex-1 p-4">
                <Droppable droppableId={columnKey}>
                  {(provided) => (
                    <div 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                      className={`min-h-[400px] ${config.bgColor} rounded-lg p-3 space-y-3`}
                    >
                      {tasks[columnKey].map((task, index) => (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`bg-white rounded-lg shadow-sm border ${config.borderColor} 
                                p-4 transition-all duration-200 hover:shadow-md
                                ${snapshot.isDragging ? 'shadow-lg ring-2 ring-gray-200' : ''}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div 
                                    {...provided.dragHandleProps}
                                    className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                                  >
                                    <GripHorizontal size={16} />
                                  </div>
                                  <span className="text-gray-700">{task.content}</span>
                                </div>
                                <button 
                                  onClick={() => removeTask(task.id, columnKey)}
                                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-colors duration-200"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                
                <button
                  onClick={() => addTaskToColumn(columnKey)}
                  className={`w-full mt-4 p-3 ${config.bgColor} ${config.borderColor} 
                    border rounded-lg flex items-center justify-center
                    text-gray-700 hover:bg-opacity-75 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.borderColor}`}
                >
                  <Plus className="mr-2" size={18} />
                  Add New Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
