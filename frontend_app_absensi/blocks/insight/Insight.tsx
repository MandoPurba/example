import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import BranchMap from "./_components/BranchMap";


export default function Insight() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <EcommerceMetrics />
      </div>
      <div className="col-span-12">
        <MonthlySalesChart />
      </div>
      {/* <div className="col-span-12">
        <MonthlyTarget />
      </div> */}

      {/* <div className="col-span-12">
        <StatisticsChart />
      </div> */}

      <div className="col-span-12">
        <BranchMap />
        {/* <DemographicCard /> */}
      </div>

      {/* <div className="col-span-12">
        <RecentOrders />
      </div> */}
    </div>
  );
}
