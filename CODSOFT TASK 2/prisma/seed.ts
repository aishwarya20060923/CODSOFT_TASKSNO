import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting DineDesk database seed (Indian Rupee / Desi Restaurant Style)...");

  // Clean existing tables in correct order
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.restaurantTable.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing records");

  // 1. Seed Users (Indian personas)
  const adminUser = await prisma.user.create({
    data: {
      name: "Chef Rajesh Kumar (Admin)",
      email: "admin@dinedesk.com",
      password: "admin123",
      role: "ADMIN",
      phone: "+91 98100 23456",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80",
    },
  });

  const kitchenUser = await prisma.user.create({
    data: {
      name: "Chef Vikram Malhotra",
      email: "kitchen@dinedesk.com",
      password: "kitchen123",
      role: "KITCHEN",
      phone: "+91 98200 87654",
      avatar: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=150&auto=format&fit=crop&q=80",
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: "Aarav Sharma",
      email: "customer@dinedesk.com",
      password: "customer123",
      role: "CUSTOMER",
      phone: "+91 98300 12345",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log("👥 Seeded 3 core users (ADMIN, KITCHEN, CUSTOMER)");

  // 2. Seed Categories
  const categories = await Promise.all([
    prisma.menuCategory.create({
      data: {
        name: "Starters & Chaat",
        slug: "starters",
        description: "Crispy tandoori kebabs, artisanal samosas, and street-style savories to kickstart your feast.",
        imageUrl: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&auto=format&fit=crop&q=80",
        displayOrder: 1,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "Main Course",
        slug: "main-course",
        description: "Slow-simmered rich curries, fragrant gravies, and sizzling tandoori platters.",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
        displayOrder: 2,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "Royal Biryani",
        slug: "biryani",
        description: "Dum-pukht handi biryanis with aged basmati, saffron, aromatic spices, and cooling burani raita.",
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
        displayOrder: 3,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "Artisan Pizza",
        slug: "pizza",
        description: "Wood-fired crispy pizzas with desi fusion and authentic Italian mozzarella toppings.",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
        displayOrder: 4,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "Gourmet Burgers",
        slug: "burgers",
        description: "Juicy brioche buns with spiced tikki, succulent chicken patties, and masala fries.",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
        displayOrder: 5,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "Mithai & Desserts",
        slug: "desserts",
        description: "Traditional kesar sweets, warm molten chocolate cakes, and rich artisanal kulfis.",
        imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
        displayOrder: 6,
        active: true,
      },
    }),
    prisma.menuCategory.create({
      data: {
        name: "Beverages & Lassi",
        slug: "beverages",
        description: "Thick creamy mango lassis, masala chai, fresh fruit sparklers, and chilled coolers.",
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
        displayOrder: 7,
        active: true,
      },
    }),
  ]);

  const [starters, mainCourse, biryani, pizza, burgers, desserts, beverages] = categories;
  console.log("📂 Seeded 7 menu categories");

  // 3. Seed Menu Items with realistic Indian Rupees (₹)
  await prisma.menuItem.createMany({
    data: [
      // Starters
      {
        name: "Tandoori Stuffed Paneer Tikka",
        description: "Charcoal-grilled cottage cheese stuffed with spicy mint chutney, marinated in hung curd and Kasuri methi.",
        price: 290,
        imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 15,
        categoryId: starters.id,
      },
      {
        name: "Amritsari Fish Fry",
        description: "Crispy carom-seed (ajwain) spiced batter-fried river sole fish with tangy mint radish lachha.",
        price: 380,
        imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80",
        isVegetarian: false,
        isSpicy: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 12,
        categoryId: starters.id,
      },
      {
        name: "Delhi Street Dahi Papdi Chaat",
        description: "Crispy flour wafers topped with spiced potatoes, sweetened curd, tamarind chutney, and roasted cumin.",
        price: 180,
        imageUrl: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: false,
        isAvailable: true,
        preparationTime: 8,
        categoryId: starters.id,
      },
      {
        name: "Murgh Malai Tikka Kebab",
        description: "Tender boneless chicken morsels steeped in rich cashew cream, green cardamom, and grilled in the tandoor.",
        price: 340,
        imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop&q=80",
        isVegetarian: false,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 15,
        categoryId: starters.id,
      },
      {
        name: "Crispy Dahi Ke Sholay",
        description: "Golden crisp bread pinwheels filled with hung spiced yogurt, fresh mint, coriander, and roasted cumin.",
        price: 240,
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 12,
        categoryId: starters.id,
      },
      {
        name: "Lucknowi Hara Bhara Kebab",
        description: "Pan-seared spinach, green pea, and cottage cheese patties infused with shahi jeera and topped with a roasted cashew.",
        price: 230,
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: false,
        isAvailable: true,
        preparationTime: 10,
        categoryId: starters.id,
      },
      {
        name: "Amritsari Tandoori Soya Chaap",
        description: "Succulent protein-rich soya chaap skewers marinated in robust Amritsari tandoori spices and charred over live charcoal.",
        price: 270,
        imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 15,
        categoryId: starters.id,
      },

      // Main Course
      {
        name: "Old Delhi Smoked Butter Chicken",
        description: "Clay-oven roasted chicken simmered in rich velvety tomato makhani gravy with pure butter and dried fenugreek.",
        price: 420,
        imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&auto=format&fit=crop&q=80",
        isVegetarian: false,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 18,
        categoryId: mainCourse.id,
      },
      {
        name: "Paneer Butter Masala Royal",
        description: "Soft malai paneer cubes cooked in aromatic tomato-cashew gravy with a dash of fresh cream and royal spices.",
        price: 340,
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 15,
        categoryId: mainCourse.id,
      },
      {
        name: "Slow-Cooked Dal Makhani",
        description: "Black lentils and kidney beans simmered overnight on charcoal with churned butter and Kashmiri chili.",
        price: 280,
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 10,
        categoryId: mainCourse.id,
      },
      {
        name: "Kashmiri Mutton Rogan Josh",
        description: "Tender goat meat braised with aromatic Kashmiri spices, shallots, dried ginger, and ratanjot extract.",
        price: 490,
        imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=500&auto=format&fit=crop&q=80",
        isVegetarian: false,
        isSpicy: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 22,
        categoryId: mainCourse.id,
      },
      {
        name: "Shahi Malai Kofta Dilkush",
        description: "Silken dumplings of fresh cottage cheese and khoya simmered in a royal cashew nut and saffron cream gravy.",
        price: 360,
        imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 16,
        categoryId: mainCourse.id,
      },
      {
        name: "Dhaba Style Dal Tadka Double Chaunk",
        description: "Yellow arhar and chana lentils simmered homestyle and tempered twice in pure desi ghee with garlic, hing, and red chillies.",
        price: 220,
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 12,
        categoryId: mainCourse.id,
      },
      {
        name: "Lehsuni Palak Paneer",
        description: "Fresh garden spinach puree cooked with charred golden garlic, house-made cottage cheese cubes, and churned butter.",
        price: 310,
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: false,
        isAvailable: true,
        preparationTime: 14,
        categoryId: mainCourse.id,
      },
      {
        name: "Banarasi Dum Aloo Kashmiri",
        description: "Baby potatoes pierced and slow-cooked in rich Kashmiri red chilli, dry ginger, and aromatic fennel-seed gravy.",
        price: 260,
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: true,
        isPopular: false,
        isAvailable: true,
        preparationTime: 15,
        categoryId: mainCourse.id,
      },

      // Biryani
      {
        name: "Hyderabadi Shahi Mutton Dum Biryani",
        description: "Prime cuts of mutton marinated in Nizami spices, layered with aged basmati rice and dum-cooked in a sealed clay handi.",
        price: 450,
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
        isVegetarian: false,
        isSpicy: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 20,
        categoryId: biryani.id,
      },
      {
        name: "Lucknowi Chicken Dum Biryani",
        description: "Fragrant Awadhi-style chicken gently cooked with saffron milk, whole cardamom, fried onions, and salan.",
        price: 360,
        imageUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80",
        isVegetarian: false,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 18,
        categoryId: biryani.id,
      },
      {
        name: "Royal Nawabi Subz Biryani",
        description: "Paneer, florets, carrots, and sweet peas layered with saffron basmati, mint leaves, and golden roasted cashews.",
        price: 290,
        imageUrl: "https://images.unsplash.com/photo-1642821373181-696a54913e9a?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: false,
        isAvailable: true,
        preparationTime: 16,
        categoryId: biryani.id,
      },
      {
        name: "Hyderabadi Paneer Tikka Dum Biryani",
        description: "Smoky tandoori paneer cubes layered with saffron-infused long grain basmati rice, caramelised onions, and royal potli spices.",
        price: 340,
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 18,
        categoryId: biryani.id,
      },
      {
        name: "Awadhi Soya Chaap Dum Biryani",
        description: "Juicy marinated soya chaap pieces cooked Awadhi dum style with aged Daawat basmati, fresh mint, and rose water.",
        price: 320,
        imageUrl: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 18,
        categoryId: biryani.id,
      },
      {
        name: "Mushroom & Matar Handi Biryani",
        description: "Wild button mushrooms and tender sweet peas slow-simmered in a sealed earthen handi with fragrant green cardamom.",
        price: 290,
        imageUrl: "https://images.unsplash.com/photo-1642821373181-696a54913e9a?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: false,
        isAvailable: true,
        preparationTime: 16,
        categoryId: biryani.id,
      },

      // Pizza
      {
        name: "Paneer Tikka Desi Fusion Pizza",
        description: "Crispy crust topped with spiced tandoori paneer, crunchy capsicum, red onions, and gooey mozzarella blend.",
        price: 360,
        imageUrl: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 14,
        categoryId: pizza.id,
      },
      {
        name: "Fiery Chicken Tikka Pizza",
        description: "Smoked spicy chicken tikka, jalapeños, red paprika, mozzarella, and cilantro drizzle on stone-baked crust.",
        price: 420,
        imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80",
        isVegetarian: false,
        isSpicy: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 15,
        categoryId: pizza.id,
      },
      {
        name: "Classic Margherita DOP",
        description: "Fresh buffalo mozzarella, tangy San Marzano tomato reduction, basil leaves, and cold-pressed olive oil.",
        price: 290,
        imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: false,
        isAvailable: true,
        preparationTime: 12,
        categoryId: pizza.id,
      },
      {
        name: "Farmhouse Garden Harvest Pizza",
        description: "Stone-baked thin crust generously loaded with crunchy bell peppers, sweet corn, black olives, red onions, and mozzarella.",
        price: 340,
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 14,
        categoryId: pizza.id,
      },
      {
        name: "Quattro Formaggi Truffle Pizza",
        description: "Four-cheese indulgence with fresh mozzarella, smoked cheddar, aged parmesan, and gorgonzola with white truffle drizzle.",
        price: 390,
        imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: false,
        isAvailable: true,
        preparationTime: 15,
        categoryId: pizza.id,
      },

      // Burgers
      {
        name: "Spicy Crispy Paneer Tower Burger",
        description: "Crunchy crumb-coated cottage cheese patty with mint mayo, sliced tomatoes, and crisp lettuce on toasted brioche.",
        price: 210,
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: true,
        isPopular: false,
        isAvailable: true,
        preparationTime: 12,
        categoryId: burgers.id,
      },
      {
        name: "Tandoori Chicken Supreme Burger",
        description: "Juicy chargrilled chicken breast dipped in tandoori spices with coleslaw and peri-peri sauce.",
        price: 250,
        imageUrl: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=80",
        isVegetarian: false,
        isSpicy: true,
        isPopular: true,
        isAvailable: true,
        preparationTime: 14,
        categoryId: burgers.id,
      },
      {
        name: "The Classic Desi Veg Aloo Tikki Burger",
        description: "Crispy spiced potato & green pea patty seasoned with chaat masala, onion rings, and tangy tamarind dip.",
        price: 150,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 10,
        categoryId: burgers.id,
      },
      {
        name: "Falafel & Herb Garlic Hummus Burger",
        description: "Crispy herb-crusted chickpea patty layered with velvety garlic hummus, pickled cucumbers, and crisp lettuce on toasted brioche.",
        price: 190,
        imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: false,
        isAvailable: true,
        preparationTime: 11,
        categoryId: burgers.id,
      },
      {
        name: "Smoky Portobello & Gouda Burger",
        description: "Char-grilled whole portobello mushroom stuffed with smoked gouda, caramelised balsamic onions, and truffle aioli.",
        price: 240,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 12,
        categoryId: burgers.id,
      },

      // Desserts
      {
        name: "Kesar Pista Shahi Gulab Jamun (2 Pcs)",
        description: "Golden fried mawa dumplings steeped in warm saffron cardamom sugar syrup, topped with roasted pistachios.",
        price: 140,
        imageUrl: "https://images.unsplash.com/photo-1605197584547-c934eb01b764?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 5,
        categoryId: desserts.id,
      },
      {
        name: "Molten Belgian Chocolate Lava Cake",
        description: "Warm dark chocolate cake with oozing center ganache, paired with a scoop of vanilla bean ice cream.",
        price: 220,
        imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 10,
        categoryId: desserts.id,
      },
      {
        name: "Rasmalai Tres Leches Cake",
        description: "Soft sponge cake infused with cardamom saffron milk, layered with delicate spongy chenna discs.",
        price: 190,
        imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: false,
        isAvailable: true,
        preparationTime: 5,
        categoryId: desserts.id,
      },
      {
        name: "Shahi Moong Dal Halwa",
        description: "Slow-roasted yellow lentils cooked patiently in pure desi ghee with saffron milk, crushed cardamom, and roasted cashews.",
        price: 170,
        imageUrl: "https://images.unsplash.com/photo-1605197584547-c934eb01b764?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 5,
        categoryId: desserts.id,
      },
      {
        name: "Matka Malai Kulfi with Falooda",
        description: "Authentic slow-reduced whole milk kulfi served in a traditional clay pot topped with fragrant rose syrup and falooda vermicelli.",
        price: 150,
        imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 5,
        categoryId: desserts.id,
      },

      // Beverages
      {
        name: "Royal Alphonso Mango Lassi",
        description: "Thick creamy churned curd blended with Ratnagiri Alphonso mango pulp and fragrant green cardamom.",
        price: 130,
        imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 5,
        categoryId: beverages.id,
      },
      {
        name: "Cutting Masala Chai Special",
        description: "Freshly brewed strong Assam tea leaves steeped with crushed ginger, cardamom, cinnamon, and whole milk.",
        price: 60,
        imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 5,
        categoryId: beverages.id,
      },
      {
        name: "Fresh Nimbu Shikanji Cooler",
        description: "Refreshing Indian lemonade prepared with fresh lime juice, crushed mint, black salt, and roasted cumin.",
        price: 90,
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: false,
        isAvailable: true,
        preparationTime: 5,
        categoryId: beverages.id,
      },
      {
        name: "Cold Brew Iced Coffee with Ice Cream",
        description: "South Indian Arabica cold brew espresso poured over creamy chilled milk with a scoop of vanilla.",
        price: 160,
        imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: false,
        isAvailable: true,
        preparationTime: 5,
        categoryId: beverages.id,
      },
      {
        name: "Kesar Badam Thandai Special",
        description: "Festive chilled milk infused with stone-ground Californian almonds, saffron, fennel seeds, watermelon kernels, and rose water.",
        price: 140,
        imageUrl: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        preparationTime: 5,
        categoryId: beverages.id,
      },
      {
        name: "Desi Masala Chaas Cooler",
        description: "Refreshing artisanal churned spiced buttermilk seasoned with roasted cumin, rock salt, ginger, and fresh garden mint.",
        price: 70,
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
        isVegetarian: true,
        isSpicy: true,
        isPopular: false,
        isAvailable: true,
        preparationTime: 5,
        categoryId: beverages.id,
      },
    ],
  });

  console.log("🍽️ Seeded 42 Indian restaurant food items (34 Pure Veg) with Rupee (₹) pricing");

  // 4. Seed Restaurant Tables (10 tables in different zones)
  const tables = await Promise.all([
    prisma.restaurantTable.create({ data: { tableNumber: 1, capacity: 2, location: "WINDOW", status: "AVAILABLE" } }),
    prisma.restaurantTable.create({ data: { tableNumber: 2, capacity: 2, location: "WINDOW", status: "AVAILABLE" } }),
    prisma.restaurantTable.create({ data: { tableNumber: 3, capacity: 4, location: "INDOOR", status: "AVAILABLE" } }),
    prisma.restaurantTable.create({ data: { tableNumber: 4, capacity: 4, location: "INDOOR", status: "OCCUPIED" } }),
    prisma.restaurantTable.create({ data: { tableNumber: 5, capacity: 4, location: "INDOOR", status: "AVAILABLE" } }),
    prisma.restaurantTable.create({ data: { tableNumber: 6, capacity: 6, location: "OUTDOOR", status: "AVAILABLE" } }),
    prisma.restaurantTable.create({ data: { tableNumber: 7, capacity: 6, location: "OUTDOOR", status: "AVAILABLE" } }),
    prisma.restaurantTable.create({ data: { tableNumber: 8, capacity: 8, location: "PRIVATE", status: "RESERVED" } }),
    prisma.restaurantTable.create({ data: { tableNumber: 9, capacity: 4, location: "WINDOW", status: "AVAILABLE" } }),
    prisma.restaurantTable.create({ data: { tableNumber: 10, capacity: 8, location: "PRIVATE", status: "AVAILABLE" } }),
  ]);

  console.log("🪑 Seeded 10 restaurant tables");

  // 5. Seed Reservations with Indian names and phone numbers
  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  await prisma.reservation.create({
    data: {
      reservationNumber: "RES-9801",
      customerName: "Aarav Sharma",
      customerEmail: "customer@dinedesk.com",
      customerPhone: "+91 98300 12345",
      date: todayStr,
      timeSlot: "07:30 PM",
      guestCount: 2,
      specialRequests: "Window seat preferred for anniversary dinner.",
      status: "CONFIRMED",
      tableId: tables[0].id,
      userId: customerUser.id,
    },
  });

  await prisma.reservation.create({
    data: {
      reservationNumber: "RES-9802",
      customerName: "Priya Patel",
      customerEmail: "priya.patel@example.com",
      customerPhone: "+91 98450 67890",
      date: todayStr,
      timeSlot: "08:00 PM",
      guestCount: 4,
      specialRequests: "Jain food preference without onion and garlic.",
      status: "CONFIRMED",
      tableId: tables[2].id,
    },
  });

  await prisma.reservation.create({
    data: {
      reservationNumber: "RES-9803",
      customerName: "Rohan Verma",
      customerEmail: "rohan.v@example.com",
      customerPhone: "+91 98110 34567",
      date: tomorrowStr,
      timeSlot: "01:00 PM",
      guestCount: 8,
      specialRequests: "Family get-together lunch, quiet area requested.",
      status: "CONFIRMED",
      tableId: tables[7].id,
    },
  });

  console.log("📅 Seeded 3 Indian customer reservations");

  // 6. Seed Sample Orders with INR Totals and 5% GST
  const items = await prisma.menuItem.findMany();
  const paneerTikka = items.find((i) => i.name.includes("Paneer Tikka")) || items[0];
  const butterChicken = items.find((i) => i.name.includes("Butter Chicken")) || items[1];
  const muttonBiryani = items.find((i) => i.name.includes("Mutton Dum Biryani")) || items[2];
  const pizzaItem = items.find((i) => i.name.includes("Pizza")) || items[3];
  const gulabJamun = items.find((i) => i.name.includes("Gulab Jamun")) || items[4];
  const mangoLassi = items.find((i) => i.name.includes("Mango Lassi")) || items[5];

  // Order 1: PLACED
  const sub1 = paneerTikka.price + butterChicken.price; // 290 + 420 = 710
  const tax1 = Number((sub1 * 0.05).toFixed(2)); // 35.50
  const tot1 = sub1 + tax1; // 745.50

  await prisma.order.create({
    data: {
      orderNumber: "ORD-20261",
      orderType: "DINE_IN",
      status: "PLACED",
      paymentStatus: "PAID",
      paymentMethod: "UPI",
      subtotal: sub1,
      tax: tax1,
      totalAmount: tot1,
      customerName: "Aarav Sharma",
      customerEmail: "customer@dinedesk.com",
      customerPhone: "+91 98300 12345",
      tableNumber: "Table 1",
      notes: "Please bring extra green mint chutney.",
      userId: customerUser.id,
      items: {
        create: [
          {
            menuItemId: paneerTikka.id,
            quantity: 1,
            unitPrice: paneerTikka.price,
            totalPrice: paneerTikka.price,
            specialInstructions: "Crispy tandoori grilled",
          },
          {
            menuItemId: butterChicken.id,
            quantity: 1,
            unitPrice: butterChicken.price,
            totalPrice: butterChicken.price,
          },
        ],
      },
      payments: {
        create: {
          transactionId: "TXN-UPI-90112",
          amount: tot1,
          status: "PAID",
          method: "UPI",
        },
      },
    },
  });

  // Order 2: ACCEPTED
  const sub2 = muttonBiryani.price + mangoLassi.price; // 450 + 130 = 580
  const tax2 = Number((sub2 * 0.05).toFixed(2)); // 29
  const tot2 = sub2 + tax2; // 609

  await prisma.order.create({
    data: {
      orderNumber: "ORD-20262",
      orderType: "TAKEAWAY",
      status: "ACCEPTED",
      paymentStatus: "PAID",
      paymentMethod: "UPI",
      subtotal: sub2,
      tax: tax2,
      totalAmount: tot2,
      customerName: "Pooja Reddy",
      customerEmail: "pooja.r@example.com",
      customerPhone: "+91 98765 43210",
      notes: "Strictly spill-proof packing.",
      items: {
        create: [
          {
            menuItemId: muttonBiryani.id,
            quantity: 1,
            unitPrice: muttonBiryani.price,
            totalPrice: muttonBiryani.price,
          },
          {
            menuItemId: mangoLassi.id,
            quantity: 1,
            unitPrice: mangoLassi.price,
            totalPrice: mangoLassi.price,
          },
        ],
      },
      payments: {
        create: {
          transactionId: "TXN-UPI-90113",
          amount: tot2,
          status: "PAID",
          method: "UPI",
        },
      },
    },
  });

  // Order 3: PREPARING
  const sub3 = pizzaItem.price + gulabJamun.price; // 360 + 140 = 500
  const tax3 = Number((sub3 * 0.05).toFixed(2)); // 25
  const tot3 = sub3 + tax3; // 525

  await prisma.order.create({
    data: {
      orderNumber: "ORD-20263",
      orderType: "DINE_IN",
      status: "PREPARING",
      paymentStatus: "PAID",
      paymentMethod: "CARD",
      subtotal: sub3,
      tax: tax3,
      totalAmount: tot3,
      customerName: "Karan Johar",
      customerEmail: "karan.j@example.com",
      customerPhone: "+91 98210 98765",
      tableNumber: "Table 4",
      notes: "Less spicy for children.",
      items: {
        create: [
          {
            menuItemId: pizzaItem.id,
            quantity: 1,
            unitPrice: pizzaItem.price,
            totalPrice: pizzaItem.price,
          },
          {
            menuItemId: gulabJamun.id,
            quantity: 1,
            unitPrice: gulabJamun.price,
            totalPrice: gulabJamun.price,
          },
        ],
      },
      payments: {
        create: {
          transactionId: "TXN-CARD-90114",
          amount: tot3,
          status: "PAID",
          method: "CARD",
        },
      },
    },
  });

  // Order 4: READY
  const sub4 = butterChicken.price + muttonBiryani.price; // 420 + 450 = 870
  const tax4 = Number((sub4 * 0.05).toFixed(2)); // 43.50
  const tot4 = sub4 + tax4; // 913.50

  await prisma.order.create({
    data: {
      orderNumber: "ORD-20264",
      orderType: "TAKEAWAY",
      status: "READY",
      paymentStatus: "PAID",
      paymentMethod: "CASH",
      subtotal: sub4,
      tax: tax4,
      totalAmount: tot4,
      customerName: "Ananya Iyer",
      customerEmail: "ananya.i@example.com",
      customerPhone: "+91 98400 11223",
      notes: "Call when boxed.",
      items: {
        create: [
          {
            menuItemId: butterChicken.id,
            quantity: 1,
            unitPrice: butterChicken.price,
            totalPrice: butterChicken.price,
          },
          {
            menuItemId: muttonBiryani.id,
            quantity: 1,
            unitPrice: muttonBiryani.price,
            totalPrice: muttonBiryani.price,
          },
        ],
      },
      payments: {
        create: {
          transactionId: "TXN-CASH-90115",
          amount: tot4,
          status: "PAID",
          method: "CASH",
        },
      },
    },
  });

  // Order 5: COMPLETED
  const sub5 = paneerTikka.price + muttonBiryani.price + gulabJamun.price; // 290 + 450 + 140 = 880
  const tax5 = Number((sub5 * 0.05).toFixed(2)); // 44
  const tot5 = sub5 + tax5; // 924

  const order5 = await prisma.order.create({
    data: {
      orderNumber: "ORD-20265",
      orderType: "DINE_IN",
      status: "COMPLETED",
      paymentStatus: "PAID",
      paymentMethod: "UPI",
      subtotal: sub5,
      tax: tax5,
      totalAmount: tot5,
      customerName: "Aarav Sharma",
      customerEmail: "customer@dinedesk.com",
      customerPhone: "+91 98300 12345",
      tableNumber: "Table 1",
      userId: customerUser.id,
      items: {
        create: [
          {
            menuItemId: paneerTikka.id,
            quantity: 1,
            unitPrice: paneerTikka.price,
            totalPrice: paneerTikka.price,
          },
          {
            menuItemId: muttonBiryani.id,
            quantity: 1,
            unitPrice: muttonBiryani.price,
            totalPrice: muttonBiryani.price,
          },
          {
            menuItemId: gulabJamun.id,
            quantity: 1,
            unitPrice: gulabJamun.price,
            totalPrice: gulabJamun.price,
          },
        ],
      },
      payments: {
        create: {
          transactionId: "TXN-UPI-90116",
          amount: tot5,
          status: "PAID",
          method: "UPI",
        },
      },
    },
  });

  console.log("📦 Seeded 5 orders in Indian Rupees (₹) with 5% GST");

  // 7. Seed Active Promo Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "WELCOME10",
        description: "10% off on your entire meal order",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderAmount: 200,
        active: true,
      },
      {
        code: "DINE20",
        description: "20% off royal celebratory dining discount",
        discountType: "PERCENTAGE",
        discountValue: 20,
        minOrderAmount: 400,
        active: true,
      },
      {
        code: "FLAT100",
        description: "Flat ₹100 instant dining voucher",
        discountType: "FLAT",
        discountValue: 100,
        minOrderAmount: 500,
        active: true,
      },
    ],
  });
  console.log("🏷️ Seeded 3 promo coupons (WELCOME10, DINE20, FLAT100)");

  // 8. Seed Customer Ratings & Reviews
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: "Incredible smoky taste with rich mint chutney! Authentic tandoor flavors.",
        userId: customerUser.id,
        menuItemId: paneerTikka.id,
        orderId: order5.id,
      },
      {
        rating: 5,
        comment: "Super tender mutton and aromatic aged basmati. Best dum biryani in town!",
        userId: customerUser.id,
        menuItemId: muttonBiryani.id,
        orderId: order5.id,
      },
      {
        rating: 4,
        comment: "Warm and delicious, saffron cardamom flavor was spot on.",
        userId: customerUser.id,
        menuItemId: gulabJamun.id,
        orderId: order5.id,
      },
      {
        rating: 5,
        comment: "Rich velvety gravy and perfectly cooked chicken. Loved every single bite!",
        userId: customerUser.id,
        menuItemId: butterChicken.id,
      },
      {
        rating: 5,
        comment: "Thick, fresh Ratnagiri Alphonso mango taste, highly recommended.",
        userId: customerUser.id,
        menuItemId: mangoLassi.id,
      },
    ],
  });
  console.log("⭐ Seeded 5 customer ratings & reviews");

  // 9. Seed Customer Wishlist / Favorites
  await prisma.favorite.createMany({
    data: [
      {
        userId: customerUser.id,
        menuItemId: paneerTikka.id,
      },
      {
        userId: customerUser.id,
        menuItemId: muttonBiryani.id,
      },
      {
        userId: customerUser.id,
        menuItemId: mangoLassi.id,
      },
    ],
  });
  console.log("❤️ Seeded 3 customer favorite dishes");

  // 10. Sample Stock Status update
  const sampleLowStock = items.find((i) => i.name.includes("Mushroom") || i.name.includes("Aloo"));
  if (sampleLowStock) {
    await prisma.menuItem.update({
      where: { id: sampleLowStock.id },
      data: { stockStatus: "LOW_STOCK" },
    });
    console.log(`📦 Configured sample low stock on ${sampleLowStock.name}`);
  }

  console.log("✅ DineDesk database successfully seeded with Indian styling and enhanced features!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
