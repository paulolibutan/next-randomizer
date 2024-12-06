/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const databaseName = process.env.DATABASE_NAME;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { participants } = body;

    if (!Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(databaseName); // Replace 'raffle' with your database name
    const collection = db.collection("participants");

    // Format participants for insertion
    const formattedParticipants = participants.map(({ emp_id, name }) => ({
      name,
      emp_id,
    }));

    try {
      // Insert participants into the database
      const result = await collection.insertMany(formattedParticipants, {
        ordered: false,
      });
      return NextResponse.json({
        message: "Participants added successfully",
        result,
      });
    } catch (error: any) {
      if (error.code === 11000) {
        // Handle duplicate key error
        return NextResponse.json(
          { message: "Some participants already exist" },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error uploading participants:", error);
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
    const collection = db.collection("participants");

    const participants = await collection.find().toArray();

    return NextResponse.json({ participants });
  } catch (error) {
    console.error("Error fetching participants:", error);
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
    const collection = db.collection("participants");

    const result = await collection.deleteMany({}); // Deletes all participants

    return NextResponse.json({
      message: "All participants deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting participants:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
