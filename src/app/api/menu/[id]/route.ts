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
      include: {
        category: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    const reviews = item.reviews || [];
    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 0;

    return NextResponse.json({
      ...item,
      stockStatus: item.stockStatus || (item.isAvailable ? "AVAILABLE" : "OUT_OF_STOCK"),
      averageRating,
      reviewCount,
    });
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

    const dataToUpdate: any = {};
    if (body.name !== undefined) dataToUpdate.name = body.name;
    if (body.description !== undefined) dataToUpdate.description = body.description;
    if (body.price !== undefined) dataToUpdate.price = parseFloat(body.price);
    if (body.imageUrl !== undefined) dataToUpdate.imageUrl = body.imageUrl;
    if (body.isVegetarian !== undefined) dataToUpdate.isVegetarian = Boolean(body.isVegetarian);
    if (body.isSpicy !== undefined) dataToUpdate.isSpicy = Boolean(body.isSpicy);
    if (body.isPopular !== undefined) dataToUpdate.isPopular = Boolean(body.isPopular);
    if (body.preparationTime !== undefined) dataToUpdate.preparationTime = parseInt(body.preparationTime, 10);
    if (body.categoryId !== undefined) dataToUpdate.categoryId = body.categoryId;

    if (body.stockStatus !== undefined) {
      dataToUpdate.stockStatus = body.stockStatus;
      dataToUpdate.isAvailable = body.stockStatus !== "OUT_OF_STOCK";
    } else if (body.isAvailable !== undefined) {
      dataToUpdate.isAvailable = Boolean(body.isAvailable);
      dataToUpdate.stockStatus = body.isAvailable ? "AVAILABLE" : "OUT_OF_STOCK";
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: dataToUpdate,
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
