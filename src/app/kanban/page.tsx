"use client";

import KanbanBoard from "./components/KanbanBoard";
import { useState, useEffect } from "react";

type ItemType = { id: string; content: string };
type ColumnType = { name: string; items: ItemType[] };
type ColumnsType = { [key: string]: ColumnType };

type BoardType = {
    id: string;
    projectId: string;
    ownerId: string;
    columns: ColumnsType;
};

type FetchResponseType = {
    body: BoardType[];
};

export default function Home() {
    const [boardId, setBoardId] = useState<string | undefined>();
    const [columns, setColumns] = useState<ColumnsType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const fetchedData = await fetchData();
                const board = fetchedData.body[0]; // Ensure fetchedData has expected structure
                setBoardId(board.id);
                setColumns(board.columns);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    // Function to fetch data from the API
    const fetchData = async (): Promise<FetchResponseType> => {
        try {
            const res = await fetch('http://localhost:3000/api/board', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                console.error("Failed to fetch data:", res.status, res.statusText);
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const jsonData = await res.json();
            return jsonData as FetchResponseType;
        } catch (error) {
            console.error("Error occurred while fetching data:", error);
            throw new Error("Failed to fetch data");
        }
    };

    const InsertColumn = async (name: string) => {
        if (!boardId) {
            console.error("Board ID is not set");
            return;
        }

        const response = await fetch('http://localhost:3000/api/columns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                order: 1,
                boardId: boardId
            })
        });
        const data = await response.json();
        console.log(data);
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">KAN board</h2>
                <div className="flex items-center space-x-2">
                    <button className="bg-blue-500 text-white py-1 px-4 rounded">Import work</button>
                    <button className="bg-gray-200 py-1 px-4 rounded">Insights</button>
                    <button className="bg-gray-200 py-1 px-4 rounded">View settings</button>
                </div>
            </div>

            <div className="flex justify-center items-center align-items-middle">
                {!loading && columns ? (
                    <KanbanBoard information={columns} InsertColumn={InsertColumn} />
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    );
}
