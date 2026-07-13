import prisma from "@/lib/prisma"
import { NextRequest } from "next/server"

// GET /api/notes — 获取全部笔记
export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  })
  return Response.json(notes)
}

// POST /api/notes — 新增笔记
export async function POST(request: NextRequest) {
  const { title, content } = await request.json()

  const note = await prisma.note.create({
    data: { title, content },
  })

  return Response.json(note, { status: 201 })
}
