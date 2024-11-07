import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// const allowedOrigins = ['https://acme.com', 'https://my-app.org'];

// Middleware function
export function middleware(request: NextRequest) {
  // ดึง cookies จาก request
  const token = request.cookies.get('next-auth.session-token')?.value || request.cookies.get('__Secure-next-auth.session-token')?.value;

  // ถ้าไม่มี token ให้ redirect ไปยังหน้า /login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ถ้ามี token ให้ผ่านไปยังหน้าเป้าหมาย
  return NextResponse.next();
}

// Matcher: เลือกเส้นทางที่ต้องการใช้ Middleware
export const config = {
  matcher: ['/', '/home/:path*', '/dashboard/:path*', '/home/:path*'],
};
