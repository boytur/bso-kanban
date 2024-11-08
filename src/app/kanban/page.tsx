"use client";

import React, { Suspense } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const KanbanBoardLazy = React.lazy(() => import("./components/KanbanBoard"));

// สร้าง QueryClient instance
const queryClient = new QueryClient();

type ItemType = { id: string; content: string };
type ColumnType = { name: string; items: ItemType[] };
type ColumnsType = { [key: string]: ColumnType };

type BoardType = {
    id: string;
    projectId: string;
    ownerId: string;
    columns: ColumnsType;
    length: number;
};

type FetchResponseType = {
    body: BoardType[];
};

export default function HomeApp() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* เพิ่ม ReactQueryDevtools สำหรับการตรวจสอบ query */}
      <ReactQueryDevtools initialIsOpen={false} />
      <Home />
    </QueryClientProvider>
  );
}

function Home() {
  // ดึงข้อมูลจาก API โดยใช้ useQuery
  const { data, error, isLoading, isFetching } = useQuery<FetchResponseType>({
    queryKey: ["boardData"],
    queryFn: fetchBoardData,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>An error has occurred: {(error as Error).message}</p>;

  const board = data?.body[0];
  if (!board) return <p>No board data available</p>;

  // ฟังก์ชัน insert column โดยใช้ boardId จากข้อมูลที่ได้รับมา
  const InsertColumn = async (name: string) => {
    if (!board.id) {
      console.error("Board ID is not set");
      return;
    }

    const response = await fetch("http://localhost:3000/api/columns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        order: data.body[0].length + 1,
        boardId: board.id,
      }),
    });
    const responseData = await response.json();
    console.log(responseData);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">KAN board</h2>
        <div className="flex items-center space-x-2">
          <button className="bg-blue-500 text-white py-1 px-4 rounded">
            Import work
          </button>
          <button className="bg-gray-200 py-1 px-4 rounded">Insights</button>
          <button className="bg-gray-200 py-1 px-4 rounded">View settings</button>
        </div>
      </div>

      <div className="flex justify-center items-center align-items-middle">
        <Suspense fallback={<p>Loading Kanban...</p>}>
          <KanbanBoardLazy information={board.columns} InsertColumn={InsertColumn} />
        </Suspense>
      </div>
      {isFetching && <p>Updating...</p>}
    </>
  );
}

// ฟังก์ชัน fetch ข้อมูล board data
async function fetchBoardData(): Promise<FetchResponseType> {
  const res = await fetch("http://localhost:3000/api/board", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return await res.json();
}

