import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, ChefHat } from "lucide-react";

interface CategorySelectionProps {
  onCategorySelect: (category: 'veg' | 'non-veg') => void;
}

const CategorySelection = ({ onCategorySelect }: CategorySelectionProps) => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Preference
          </h2>
          <p className="text-xl text-muted-foreground">
            Select from our carefully curated vegetarian and non-vegetarian options
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Vegetarian Card */}
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-card-hover transform hover:scale-105 border-2 hover:border-secondary">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-veg-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                <Leaf className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Vegetarian
              </h3>
              <p className="text-muted-foreground mb-6">
                Fresh, organic vegetables and plant-based delicacies prepared with love and care
              </p>
              <Button 
                onClick={() => onCategorySelect('veg')}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 rounded-lg"
              >
                Explore Veg Menu
              </Button>
              <div className="mt-4 flex justify-center space-x-2 text-2xl">
                <span>🥗</span>
                <span>🍛</span>
                <span>🥘</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Non-Vegetarian Card */}
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-card-hover transform hover:scale-105 border-2 hover:border-primary">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-food-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                <ChefHat className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Non-Vegetarian
              </h3>
              <p className="text-muted-foreground mb-6">
                Premium meats, fresh seafood, and traditional recipes that satisfy every craving
              </p>
              <Button 
                onClick={() => onCategorySelect('non-veg')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg"
              >
                Explore Non-Veg Menu
              </Button>
              <div className="mt-4 flex justify-center space-x-2 text-2xl">
                <span>🍖</span>
                <span>🍗</span>
                <span>🍤</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CategorySelection;