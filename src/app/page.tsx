import { menuData } from '@/data/menu';
import { calculateStats } from '@/lib/calculations';
import Hero from '@/components/Hero';
import MenuSection from '@/components/MenuSection';
import MenuItem from '@/components/MenuItem';
import WelcomeSection from '@/components/WelcomeSection';
import ServicesTable from '@/components/ServicesTable';
import StatsSummary from '@/components/StatsSummary';
import Footer from '@/components/Footer';

export default function Home() {
  const stats = calculateStats(menuData);

  return (
    <main>
      <Hero
        eventTitle={menuData.eventTitle}
        eventTime={menuData.eventTime}
        persons={menuData.persons}
        grandTotal={stats.grandTotal}
        client={menuData.client}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Banquet menu sections */}
        {menuData.banquet.map((category) => (
          <MenuSection key={category.id} title={category.title}>
            {category.items.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </MenuSection>
        ))}

        {/* Welcome zone */}
        <WelcomeSection items={menuData.welcome} />

        {/* Services */}
        <ServicesTable services={menuData.services} persons={menuData.persons} />

        {/* Cost summary */}
        <StatsSummary stats={stats} />
      </div>

      <Footer />
    </main>
  );
}
