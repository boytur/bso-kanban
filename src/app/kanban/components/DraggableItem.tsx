import React from 'react';
import dynamic from 'next/dynamic';

const Draggable = dynamic(() => import('react-beautiful-dnd').then(mod => mod.Draggable), { ssr: false });

type ItemType = { id: string; content: string };

interface DraggableItemProps {
    item: ItemType;
    index: number;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index }) => {
    return (
        <>
            <Draggable draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-4 rounded-md shadow ${snapshot.isDragging ? 'bg-teal-800' : 'bg-teal-600'
                            } text-white`}
                        style={{
                            ...provided.draggableProps.style,
                            boxShadow: snapshot.isDragging ? '0px 4px 8px rgba(0,0,0,0.3)' : 'none',
                        }}
                    >
                        {item.content}
                    </div>
                )}
            </Draggable>
        </>
    );
};

export default DraggableItem;
