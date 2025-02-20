import dynamic from 'next/dynamic';

const CalculatorPage = dynamic(() =>
  import('../../calculator/app/page')
);

export default function CalculatorRoute() {
  return <CalculatorPage />;
}
