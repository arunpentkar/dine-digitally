import { Button } from "@/components/ui/button";
import { ShoppingCart, User } from "lucide-react";

interface HeaderProps {
  cartItems: number;
  onCartClick: () => void;
  onLoginClick: () => void;
}

const Header = ({ cartItems, onCartClick, onLoginClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-food-gradient rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">F</span>
          </div>
          <h1 className="text-2xl font-bold bg-food-gradient bg-clip-text text-transparent">
            FoodieHub
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onCartClick}
            className="relative"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </Button>
          <Button onClick={onLoginClick} size="sm">
            <User className="w-4 h-4 mr-2" />
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;