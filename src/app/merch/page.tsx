import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "Tema Royals Jersey", price: "$30.00", cat: "Jerseys", image: "/TemaRoyalsJersey.png" },
  { id: 2, name: "Tema Royals Cap", price: "$15.00", cat: "Accessories", image: "/temaroyalscap.png" },
  { id: 3, name: "Tema Royals Away Kit", price: "$30.00", cat: "Jerseys", image: "/TemaRoyalsAwaykit.png" },
];

export default function MerchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl mb-4">ROYALS SHOP</h1>
            <p className="text-muted-foreground">Wear the colors. Support Tema.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((prod) => (
              <Card key={prod.id} className="bg-card border-accent/10 overflow-hidden group">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint="soccer kit"
                  />
                  <div className="absolute top-4 right-4">
                    <Button size="icon" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/80">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-accent uppercase font-bold tracking-widest mb-1">{prod.cat}</p>
                  <h3 className="text-xl font-bold mb-2">{prod.name}</h3>
                  <p className="text-2xl font-black">{prod.price}</p>
                  <Button className="w-full mt-6 bg-primary font-bold">ADD TO CART</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
