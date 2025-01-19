interface FeeCalculation {
  amount: number;
  fee: number;
  percentage: number;
}

const calculateFees = (shiftCost: number): Record<string, FeeCalculation> => {
  const CLIENT_FEE_PERCENTAGE = 0.08;
  const FREELANCER_FEE_PERCENTAGE = 0.10;
  const AGENCY_FEE_PERCENTAGE = 0.06;

  return {
    client: {
      amount: shiftCost * (1 + CLIENT_FEE_PERCENTAGE),
      fee: shiftCost * CLIENT_FEE_PERCENTAGE,
      percentage: CLIENT_FEE_PERCENTAGE * 100
    },
    freelancer: {
      amount: shiftCost * (1 - FREELANCER_FEE_PERCENTAGE),
      fee: shiftCost * FREELANCER_FEE_PERCENTAGE,
      percentage: FREELANCER_FEE_PERCENTAGE * 100
    },
    agency: {
      amount: shiftCost * (1 - AGENCY_FEE_PERCENTAGE),
      fee: shiftCost * AGENCY_FEE_PERCENTAGE,
      percentage: AGENCY_FEE_PERCENTAGE * 100
    }
  };
};

export default function FeeStructure() {
  const [shiftCost, setShiftCost] = useState(100);
  const [showMonthlyEstimate, setShowMonthlyEstimate] = useState(false);
  const [shiftsPerMonth, setShiftsPerMonth] = useState(20);
  
  const fees = calculateFees(shiftCost);
  const monthlyFees = calculateFees(shiftCost * shiftsPerMonth);

  // Component JSX with added monthly estimates toggle
  return (
    <Card className="w-full max-w-3xl mx-auto">
      {/* Existing content with monthly estimates section */}
    </Card>
  );
}