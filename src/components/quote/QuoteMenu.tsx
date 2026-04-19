import { MenuData } from '@/types';
import MenuSection from './MenuSection';
import MenuItem from './MenuItem';
import WelcomeSection from './WelcomeSection';
import ServicesTable from './ServicesTable';

export default function QuoteMenu({ menuData }: { menuData: MenuData }) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4">
      {menuData.banquet.map((category) => {
        const catTotal = category.items.reduce(
          (sum, item) => sum + item.pricePerUnit * item.quantity,
          0
        );
        return (
          <MenuSection key={category.id} title={category.title} categoryTotal={catTotal}>
            {category.items.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </MenuSection>
        );
      })}

      <WelcomeSection items={menuData.welcome} />

      <ServicesTable services={menuData.services} persons={menuData.persons} />
    </div>
  );
}
