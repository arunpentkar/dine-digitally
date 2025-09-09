import { MenuItem } from "@/types";

export const menuItems: MenuItem[] = [
  // Vegetarian Items
  {
    id: "1",
    name: "Paneer Butter Masala",
    description: "Rich and creamy paneer curry with aromatic spices and butter",
    price: 280,
    image: "https://images.unsplash.com/photo-1631292784640-8b0dc3246186?w=400",
    category: "veg",
    rating: 4.8,
    cookingTime: 25,
    isPopular: true
  },
  {
    id: "2", 
    name: "Vegetable Biryani",
    description: "Fragrant basmati rice with mixed vegetables and traditional spices",
    price: 250,
    image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400",
    category: "veg",
    rating: 4.6,
    cookingTime: 35
  },
  {
    id: "3",
    name: "Dal Makhani",
    description: "Slow-cooked black lentils in rich tomato and cream sauce",
    price: 220,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    category: "veg",
    rating: 4.7,
    cookingTime: 20
  },
  {
    id: "4",
    name: "Palak Paneer",
    description: "Fresh spinach curry with soft paneer cubes and aromatic spices",
    price: 260,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    category: "veg",
    rating: 4.5,
    cookingTime: 22
  },
  {
    id: "5",
    name: "Veg Hakka Noodles",
    description: "Stir-fried noodles with fresh vegetables and Indo-Chinese flavors",
    price: 180,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
    category: "veg",
    rating: 4.4,
    cookingTime: 15
  },
  {
    id: "6",
    name: "Margherita Pizza",
    description: "Classic pizza with fresh tomatoes, mozzarella, and basil",
    price: 320,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
    category: "veg",
    rating: 4.6,
    cookingTime: 18
  },

  // Non-Vegetarian Items
  {
    id: "7",
    name: "Butter Chicken",
    description: "Tender chicken in rich tomato-based curry with cream and butter",
    price: 350,
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
    category: "non-veg",
    rating: 4.9,
    cookingTime: 30,
    isPopular: true
  },
  {
    id: "8",
    name: "Chicken Biryani", 
    description: "Aromatic basmati rice with succulent chicken pieces and spices",
    price: 380,
    image: "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400",
    category: "non-veg",
    rating: 4.8,
    cookingTime: 40
  },
  {
    id: "9",
    name: "Fish Curry",
    description: "Fresh fish cooked in coconut-based curry with traditional spices",
    price: 420,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    category: "non-veg",
    rating: 4.7,
    cookingTime: 25
  },
  {
    id: "10",
    name: "Chicken Tikka",
    description: "Marinated chicken grilled to perfection with aromatic spices",
    price: 320,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400",
    category: "non-veg",
    rating: 4.6,
    cookingTime: 28
  },
  {
    id: "11",
    name: "Mutton Curry",
    description: "Tender mutton pieces in rich and spicy traditional curry",
    price: 450,
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400",
    category: "non-veg",
    rating: 4.8,
    cookingTime: 45
  },
  {
    id: "12",
    name: "Chicken Shawarma",
    description: "Grilled chicken wrapped in pita bread with fresh vegetables",
    price: 180,
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400",
    category: "non-veg",
    rating: 4.5,
    cookingTime: 12
  }
];