import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-food.jpg";

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-hero-gradient opacity-90"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-slideIn">
          Delicious Food
          <br />
          <span className="bg-accent bg-clip-text text-transparent">
            Delivered Fast
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Discover amazing dishes from your favorite restaurants. 
          Fresh ingredients, quick delivery, and flavors that make you smile.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg font-semibold rounded-xl shadow-card-hover transition-all duration-300 transform hover:scale-105"
          >
            Order Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-6 text-primary-foreground/80 text-sm">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
              30 min delivery
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
              Fresh & Hot
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating food icons */}
      <div className="absolute top-20 left-10 text-4xl animate-float" style={{ animationDelay: '0s' }}>
        🍕
      </div>
      <div className="absolute top-40 right-20 text-3xl animate-float" style={{ animationDelay: '1s' }}>
        🍔
      </div>
      <div className="absolute bottom-40 left-20 text-3xl animate-float" style={{ animationDelay: '2s' }}>
        🍜
      </div>
    </section>
  );
};

export default Hero;