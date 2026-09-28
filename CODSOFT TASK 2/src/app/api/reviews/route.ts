import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const menuItemId = searchParams.get("menuItemId");
    const userId = searchParams.get("userId");
    const orderId = searchParams.get("orderId");

    const whereClause: any = {};
    if (menuItemId) whereClause.menuItemId = menuItemId;
    if (userId) whereClause.userId = userId;
    if (orderId) whereClause.orderId = orderId;

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
        menuItem: {
          select: { id: true, name: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute average rating if queried for menuItemId
    let averageRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      averageRating = Number((sum / reviews.length).toFixed(1));
    }

    return NextResponse.json({
      reviews,
      totalReviews: reviews.length,
      averageRating,
    });
  } catch (error: any) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, comment, menuItemId, userId, orderId } = body;

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5 stars" }, { status: 400 });
    }

    if (!menuItemId || !userId) {
      return NextResponse.json({ error: "Menu item ID and user ID are required" }, { status: 400 });
    }

    // If orderId is provided, verify order is completed and contains the item
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        return NextResponse.json({ error: "Referenced order not found" }, { status: 404 });
      }

      if (order.status !== "COMPLETED") {
        return NextResponse.json({
          error: "You can only review dishes after the order is completed.",
        }, { status: 400 });
      }

      const hasItem = order.items.some((i) => i.menuItemId === menuItemId);
      if (!hasItem) {
        return NextResponse.json({
          error: "This item was not found in the specified order.",
        }, { status: 400 });
      }

      // Check for existing review on this order item to prevent repeated submissions
      const existing = await prisma.review.findFirst({
        where: {
          userId,
          menuItemId,
          orderId,
        },
      });

      if (existing) {
        return NextResponse.json({
          error: "You have already reviewed this dish for this order. Thank you!",
        }, { status: 409 });
      }
    }

    const review = await prisma.review.create({
      data: {
        rating: parsedRating,
        comment: comment ? String(comment).trim() : null,
        menuItemId,
        userId,
        orderId: orderId || null,
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/reviews error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({
        error: "You have already submitted a review for this dish.",
      }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "Failed to submit review" }, { status: 500 });
  }
}
