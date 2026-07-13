import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 这个页面需要查数据库，不允许构建时预渲染
export const dynamic = "force-dynamic"

// 新增笔记（Server Action）
async function createNote(formData: FormData) {
  "use server"

  const title = formData.get("title") as string
  const content = formData.get("content") as string

  await prisma.note.create({
    data: { title, content },
  })

  revalidatePath("/")
}

export default async function Home() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">📝 记事本</h1>

      {/* 新增表单 */}
      <form action={createNote} className="mb-8 space-y-3">
        <input
          name="title"
          placeholder="标题"
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        <textarea
          name="content"
          placeholder="内容"
          rows={3}
          required
          className="w-full border rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          添加
        </button>
      </form>

      {/* 笔记列表 */}
      <div className="space-y-4">
        {notes.length === 0 && (
          <p className="text-zinc-400">还没有笔记，添加一条吧</p>
        )}
        {notes.map((note) => (
          <div key={note.id} className="border rounded-lg p-4">
            <h2 className="font-semibold">{note.title}</h2>
            <p className="text-zinc-600 text-sm mt-1">{note.content}</p>
            <p className="text-zinc-400 text-xs mt-2">
              {note.createdAt.toLocaleString("zh-CN")}
            </p>
          </div>
        ))}
      </div>

      <footer className="mt-12 text-center text-zinc-400 text-sm">
        数据库共 {notes.length} 条记录
      </footer>
    </main>
  )
}
