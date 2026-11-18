
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

// GET: Fetch all notes
export async function GET() {
  try {
    const notes = await sql`
      SELECT * FROM notes
      ORDER BY created_at DESC
    `;

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST: Add a new note
export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    if (
      typeof title !== "string" ||
      typeof content !== "string" ||
      !title.trim() ||
      !content.trim()
    ) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO notes (title, content)
      VALUES (${title.trim()}, ${content.trim()})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error adding note:", error);
    return NextResponse.json(
      { error: "Failed to add note" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a note
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Valid note ID is required" },
        { status: 400 }
      );
    }

    await sql`
      DELETE FROM notes
      WHERE id = ${id}
    `;

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
