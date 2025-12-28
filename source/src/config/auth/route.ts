import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    const validUsers = [
      { username: "admin", password: "admin123" },
      { username: "user", password: "user123" },
    ]

    const user = validUsers.find((u) => u.username === username && u.password === password)

    if (user) {
      return NextResponse.json({ success: true, message: "Login successful" }, { status: 200 })
    } else {
      return NextResponse.json({ success: false, message: "Invalid username or password" }, { status: 401 })
    }
  } catch (error) {
    console.error("[v0] Login API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
