import React, { RefObject } from 'react';

interface AddColumnFormProps {
    newColumnName: string;
    handleNewColumnNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAddColumn: () => void;
    cancelAddColumn: () => void;
    isDuplicateName: boolean;
    inputRef: RefObject<HTMLInputElement>;
}

const AddColumnForm: React.FC<AddColumnFormProps> = ({
    newColumnName,
    handleNewColumnNameChange,
    handleAddColumn,
    cancelAddColumn,
    isDuplicateName,
    inputRef,
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-200 rounded-lg h-32 w-64 gap-2">
            <input
                ref={inputRef}
                type="text"
                placeholder="ใส่ชื่อคอลัมน์ใหม่"
                value={newColumnName}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddColumn();
                }}
                onChange={handleNewColumnNameChange}
                className={`p-2 w-full border-2 rounded ${isDuplicateName ? 'border-red-500' : 'border-gray-300'}`}
            />
            <button onClick={handleAddColumn} className="bg-teal-500 text-white py-1 px-4 rounded hover:bg-teal-600">
                เพิ่ม
            </button>
            <button onClick={cancelAddColumn} className="text-gray-500 text-sm mt-1 hover:underline">
                ยกเลิก
            </button>
        </div>
    );
};

export default AddColumnForm;
