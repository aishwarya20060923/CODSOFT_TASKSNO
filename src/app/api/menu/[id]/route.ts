import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.imageUrl && { imageUrl: body.imageUrl }),
        ...(body.isVegetarian !== undefined && { isVegetarian: Boolean(body.isVegetarian) }),
        ...(body.isSpicy !== undefined && { isSpicy: Boolean(body.isSpicy) }),
        ...(body.isPopular !== undefined && { isPopular: Boolean(body.isPopular) }),
        ...(body.isAvailable !== undefined && { isAvailable: Boolean(body.isAvailable) }),
        ...(body.preparationTime !== undefined && { preparationTime: parseInt(body.preparationTime, 10) }),
        ...(body.categoryId && { categoryId: body.categoryId }),
      },
      include: { category: true },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /api/menu/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Item deleted" });
  } catch (error: any) {
    console.error("DELETE /api/menu/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
