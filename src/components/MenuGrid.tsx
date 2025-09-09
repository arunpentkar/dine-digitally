import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Plus } from "lucide-react";
import { MenuItem } from "@/types";

interface MenuGridProps {
  items: MenuItem[];
  category: 'veg' | 'non-veg';
  onAddToCart: (item: MenuItem) => void;
  onBack: () => void;
}

const MenuGrid = ({ items, category, onAddToCart, onBack }: MenuGridProps) => {
  const categoryIcon = category === 'veg' ? '🌿' : '🥩';
  const categoryColor = category === 'veg' ? 'bg-secondary' : 'bg-primary';

  return (
    <section className="py-20 px-4 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Button 
              variant="outline" 
              onClick={onBack}
              className="mb-4"
            >
              ← Back to Categories
            </Button>
            <h2 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <span className="text-3xl">{categoryIcon}</span>
              {category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'} Menu
            </h2>
            <p className="text-xl text-muted-foreground mt-2">
              Handpicked {category === 'veg' ? 'vegetarian' : 'non-vegetarian'} dishes made with love
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="group overflow-hidden transition-all duration-300 hover:shadow-card-hover transform hover:scale-105">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {item.isPopular && (
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                    🔥 Popular
                  </Badge>
                )}
                <div className={`absolute top-3 right-3 w-6 h-6 ${categoryColor} rounded-full flex items-center justify-center`}>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">{item.rating}</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {item.cookingTime} mins
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    ₹{item.price}
                  </span>
                </div>
                
                <Button 
                  onClick={() => onAddToCart(item)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuGrid;