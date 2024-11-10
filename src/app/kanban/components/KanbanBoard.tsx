'use client';
import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef } from 'react';
import Column from './Column';
import AddColumnForm from './AddColumnForm';

const DragDropContext = dynamic(() => import('react-beautiful-dnd').then(mod => mod.DragDropContext), { ssr: false });
const Droppable = dynamic(() => import('react-beautiful-dnd').then(mod => mod.Droppable), { ssr: false });
import { DropResult } from 'react-beautiful-dnd';

type ItemType = { id: string; content: string };
type ColumnType = { name: string; items: ItemType[] };
type ColumnsType = { [key: string]: ColumnType };

interface KanbanBoardProps {
    information: ColumnsType;
    InsertColumn: (name: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
    information,
    InsertColumn,
}) => {
    const [data, setData] = useState<ColumnsType>(information);
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState("");
    const [isDuplicateName, setIsDuplicateName] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {

        if (inputRef.current) {
            if (isDuplicateName) {
                inputRef.current.blur();
            } else {
                inputRef.current.focus();
            }
        }
    }, [isDuplicateName, isAddingColumn]);

    const onDragEnd = async (result: DropResult) => {
        const { source, destination, type } = result;
        if (!destination) return;

        if (type === "column") {
            const columns = Object.entries(data);
            const [movedColumn] = columns.splice(source.index, 1);
            columns.splice(destination.index, 0, movedColumn);

            const reorderedData = Object.fromEntries(columns);
            setData(reorderedData);
        } else {
            const sourceColumn = data[source.droppableId];
            const destColumn = data[destination.droppableId];
            const sourceItems = Array.from(sourceColumn.items);
            const destItems = Array.from(destColumn.items);
            const [movedItem] = sourceItems.splice(source.index, 1);

            if (sourceColumn === destColumn) {
                sourceItems.splice(destination.index, 0, movedItem);
                setData({ ...data, [source.droppableId]: { ...sourceColumn, items: sourceItems } });
                await updateTaskOrder(movedItem.id, destination.droppableId, destination.index);
            } else {
                destItems.splice(destination.index, 0, movedItem);
                setData({
                    ...data,
                    [source.droppableId]: { ...sourceColumn, items: sourceItems },
                    [destination.droppableId]: { ...destColumn, items: destItems },
                });
                await updateTaskOrder(movedItem.id, destination.droppableId, destination.index);
            }
        }
    };

    const addColumn = () => setIsAddingColumn(true);

    const handleNewColumnNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value.trim();
        setNewColumnName(name);
        setIsDuplicateName(Object.values(data).some(column => column.name === name));
    };

    const handleAddColumn = () => {
        if (isDuplicateName || !newColumnName.trim()) return;
        const newColumnId = `column-${Object.keys(data).length + 1}`;
        InsertColumn(newColumnName);
        setData({ ...data, [newColumnId]: { name: newColumnName, items: [] } });
        setNewColumnName("");
        setIsAddingColumn(false);
    };

    const cancelAddColumn = () => {
        setIsAddingColumn(false);
        setNewColumnName("");
        setIsDuplicateName(false);
    };

    const insertTask = async (name: string, columnId: string, order: number) => {
        const response = await fetch("http://localhost:3000/api/tasks", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                columnId: columnId,
                order: order
            })
        });
    }

    const updateTaskOrder = async (taskId: string, columnId: string, order: number) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ columnId, order }),
            });

            if (!response.ok) {
                throw new Error("Failed to update task order");
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="container overflow-x-auto max-h-[700px] bg-white rounded-lg shadow-lg">
                    <div className="flex flex-nowrap min-h-[700px] gap-4">
                        <Droppable droppableId="all-columns" direction="horizontal" type="column" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false} >
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="flex gap-6 rounded-lg text-black"
                                >
                                    {Object.entries(data).map(([columnId, column], index) => (
                                        <Column
                                            key={columnId}
                                            columnId={columnId}
                                            column={column}
                                            index={index}
                                            data={data}
                                            setData={setData}
                                            insertTask={insertTask}
                                        />
                                    ))}
                                    {provided.placeholder}
                                    {isAddingColumn && (
                                        <AddColumnForm
                                            newColumnName={newColumnName}
                                            handleNewColumnNameChange={handleNewColumnNameChange}
                                            handleAddColumn={handleAddColumn}
                                            cancelAddColumn={cancelAddColumn}
                                            isDuplicateName={isDuplicateName}
                                            inputRef={inputRef}
                                        />
                                    )}
                                    <button
                                        onClick={addColumn}
                                        className={`${isAddingColumn ? 'hidden' : 'block'} bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 h-10 mt-5`}
                                    >
                                        <b>+</b>
                                    </button>
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            </DragDropContext>
        </>
    );
};

export default KanbanBoard;
