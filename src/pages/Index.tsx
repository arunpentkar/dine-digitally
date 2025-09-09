import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategorySelection from "@/components/CategorySelection";
import MenuGrid from "@/components/MenuGrid";
import { menuItems } from "@/data/menuItems";
import { MenuItem, CartItem } from "@/types";

type ViewState = 'hero' | 'categories' | 'menu';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewState>('hero');
  const [selectedCategory, setSelectedCategory] = useState<'veg' | 'non-veg' | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setCurrentView('categories');
  };

  const handleCategorySelect = (category: 'veg' | 'non-veg') => {
    setSelectedCategory(category);
    setCurrentView('menu');
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
  };

  const handleAddToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    toast({
      title: "Added to Cart!",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleCartClick = () => {
    toast({
      title: "Cart",
      description: `You have ${cartItems.reduce((total, item) => total + item.quantity, 0)} items in your cart.`,
    });
  };

  const handleLoginClick = () => {
    toast({
      title: "Login",
      description: "Login functionality will be implemented with Supabase Auth.",
    });
  };

  const filteredMenuItems = selectedCategory 
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={totalCartItems}
        onCartClick={handleCartClick}
        onLoginClick={handleLoginClick}
      />
      
      {currentView === 'hero' && (
        <Hero onGetStarted={handleGetStarted} />
      )}
      
      {currentView === 'categories' && (
        <CategorySelection onCategorySelect={handleCategorySelect} />
      )}
      
      {currentView === 'menu' && selectedCategory && (
        <MenuGrid 
          items={filteredMenuItems}
          category={selectedCategory}
          onAddToCart={handleAddToCart}
          onBack={handleBackToCategories}
        />
      )}
    </div>
  );
};

export default Index;
