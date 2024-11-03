"use client";
import { useSession, signIn, signOut } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>กำลังโหลด...</p>;
  }

  return (
    <div>
      {!session ? (
        <>
          <p>คุณยังไม่ได้ล็อกอิน</p>
          <button onClick={() => signIn()}>ล็อกอิน</button>
        </>
      ) : (
        <>
          <p>ยินดีต้อนรับ {session.user?.email}</p>
          <button onClick={() => signOut()}>ออกจากระบบ</button>
        </>
      )}
    </div>
  );
}
