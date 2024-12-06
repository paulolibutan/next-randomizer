import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const databaseName = process.env.DATABASE_NAME;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { winner } = body;

    if (!winner || !winner._id || !winner.name) {
      return NextResponse.json(
        { message: "Invalid winner data" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(databaseName);
    const participantsCollection = db.collection("participants");
    const winnersCollection = db.collection("winners");

    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        // Insert winner
        await winnersCollection.insertOne(winner, { session });

        // Convert _id to ObjectId if needed
        const query = { _id: new ObjectId(winner._id) };

        // Debugging logs
        console.log("Deleting participant with query:", query);

        // Remove winner from participants
        const result = await participantsCollection.deleteOne(query, {
          session,
        });

        // Check delete result
        console.log("Delete result:", result);
        if (result.deletedCount === 0) {
          throw new Error("No participant found to delete");
        }
      });

      return NextResponse.json({
        message: "Winner saved and removed successfully.",
        winner,
      });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("Error saving winner:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(databaseName);
    const winners = await db.collection("winners").find().toArray();

    return NextResponse.json({ winners });
  } catch (error) {
    console.error("Error fetching winners:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const client = await clientPromise;
    const db = client.db(databaseName);
    const winnersCollection = db.collection("winners");

    // Delete all documents in the winners collection
    await winnersCollection.deleteMany({});

    return NextResponse.json({ message: "All winners have been deleted." });
  } catch (error) {
    console.error("Error deleting winners:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
