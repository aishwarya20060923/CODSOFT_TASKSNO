import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const vegetarian = searchParams.get("vegetarian");
    const spicy = searchParams.get("spicy");
    const availableOnly = searchParams.get("availableOnly") === "true";

    const whereClause: any = {};

    if (categorySlug && categorySlug !== "all") {
      whereClause.category = { slug: categorySlug };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (vegetarian === "true") {
      whereClause.isVegetarian = true;
    }

    if (spicy === "true") {
      whereClause.isSpicy = true;
    }

    if (availableOnly) {
      whereClause.isAvailable = true;
    }

    const items = await prisma.menuItem.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: [
        { isPopular: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(items);
  } catch (error: any) {
    console.error("GET /api/menu error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch menu items" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      price,
      imageUrl,
      isVegetarian,
      isSpicy,
      isPopular,
      isAvailable,
      preparationTime,
      categoryId,
    } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: "Name, price, and category are required" }, { status: 400 });
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
        isVegetarian: Boolean(isVegetarian),
        isSpicy: Boolean(isSpicy),
        isPopular: Boolean(isPopular),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        preparationTime: parseInt(preparationTime, 10) || 15,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/menu error:", error);
    return NextResponse.json({ error: error.message || "Failed to create menu item" }, { status: 500 });
  }
}
