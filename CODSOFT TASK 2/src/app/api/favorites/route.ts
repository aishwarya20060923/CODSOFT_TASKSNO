import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        menuItem: {
          include: {
            category: true,
            reviews: {
              select: { rating: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Enrich with average ratings
    const enriched = favorites.map((fav) => {
      const reviews = fav.menuItem.reviews || [];
      const reviewCount = reviews.length;
      const averageRating =
        reviewCount > 0
          ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
          : 0;

      return {
        ...fav,
        menuItem: {
          ...fav.menuItem,
          averageRating,
          reviewCount,
          isFavorite: true,
        },
      };
    });

    return NextResponse.json(enriched);
  } catch (error: any) {
    console.error("GET /api/favorites error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, menuItemId } = body;

    if (!userId || !menuItemId) {
      return NextResponse.json({ error: "userId and menuItemId are required" }, { status: 400 });
    }

    // Check if already in favorites
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_menuItemId: {
          userId,
          menuItemId,
        },
      },
    });

    if (existing) {
      // Toggle off / remove
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ isFavorite: false, message: "Removed from favorites" });
    } else {
      // Add to favorites
      await prisma.favorite.create({
        data: {
          userId,
          menuItemId,
        },
      });
      return NextResponse.json({ isFavorite: true, message: "Added to favorites" }, { status: 201 });
    }
  } catch (error: any) {
    console.error("POST /api/favorites error:", error);
    return NextResponse.json({ error: error.message || "Failed to toggle favorite" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const menuItemId = searchParams.get("menuItemId");

    if (!userId || !menuItemId) {
      return NextResponse.json({ error: "userId and menuItemId are required" }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: {
        userId,
        menuItemId,
      },
    });

    return NextResponse.json({ success: true, message: "Removed from favorites" });
  } catch (error: any) {
    console.error("DELETE /api/favorites error:", error);
    return NextResponse.json({ error: error.message || "Failed to remove favorite" }, { status: 500 });
  }
}
