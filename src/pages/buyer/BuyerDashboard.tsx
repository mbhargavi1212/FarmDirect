import React from 'react';
import {
  Building2,
  ShoppingBag,
  Truck,
  TrendingUp,
  CreditCard,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';

interface BuyerDashboardProps {
  onNavigate: (path: string) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { formatCurrency, orders } = useApp();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 font-heading">
              Procurement Desk: {user?.businessDetails?.businessName || user?.displayName}
            </h1>
            <Badge variant="info" size="sm">FSSAI / Verified Retailer</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Direct farmer-gate institutional sourcing with smart escrow protection
          </p>
        </div>

        <Button
          variant="primary"
          icon={Search}
          onClick={() => onNavigate('/marketplace')}
        >
          Source Fresh Produce
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Escrow Procurement Pool"
          value={formatCurrency(user?.walletBalance || 420000)}
          subtext="Protected under automated smart contract"
          icon={CreditCard}
          accentColor="sky"
        />
        <StatCard
          label="Active Direct Orders"
          value="2 Contracts"
          subtext="1 in transit, 1 fulfilled"
          icon={ShoppingBag}
          accentColor="emerald"
        />
        <StatCard
          label="Sourcing Cost Savings"
          value="-18.2%"
          trend={{ value: 'Saved ₹29.6k', isPositive: true }}
          subtext="vs Mandi secondary broker fees"
          icon={TrendingUp}
          accentColor="emerald"
        />
        <StatCard
          label="Live In-Transit Fleets"
          value="1 Vehicle"
          subtext="ETA Pune Hub in 22 hrs"
          icon={Truck}
          accentColor="amber"
        />
      </div>

      {/* Current Shipments Table */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Current Purchase Contracts & Tracking
            </h2>
            <p className="text-xs text-slate-500">Live GPS tracking and transparent settlement</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => onNavigate('/buyer/orders')}
          >
            All Purchases
          </Button>
        </div>

        <Table
          columns={[
            {
              header: 'Contract Ref',
              cell: (ord) => (
                <div>
                  <p className="font-bold text-slate-900">{ord.orderNumber}</p>
                  <p className="text-[11px] text-slate-400">{new Date(ord.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              ),
            },
            {
              header: 'Producer / Farm',
              cell: (ord) => (
                <div>
                  <p className="font-bold text-slate-800">{ord.farmerName}</p>
                  <p className="text-[11px] text-slate-500">Direct Farm-Gate Source</p>
                </div>
              ),
            },
            {
              header: 'Produce Ordered',
              cell: (ord) => (
                <div>
                  <p className="font-medium text-slate-900">{ord.items[0]?.productTitle}</p>
                  <p className="text-xs text-slate-500">{ord.totalQuantityKg.toLocaleString('en-IN')} kg</p>
                </div>
              ),
            },
            {
              header: 'Escrow Amount',
              cell: (ord) => (
                <div>
                  <p className="font-bold text-slate-900">{formatCurrency(ord.totalAmount)}</p>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Saved ₹{(ord.traditionalMandiIntermediaryCut ?? 0).toLocaleString('en-IN')} commission
                  </span>
                </div>
              ),
            },
            {
              header: 'Transit Status',
              cell: (ord) => (
                <Badge
                  variant={ord.status === 'in_transit' ? 'info' : 'success'}
                  size="sm"
                >
                  {ord.status === 'in_transit' ? 'In Transit (Truck MP-04)' : 'Delivered'}
                </Badge>
              ),
            },
            {
              header: 'Action',
              cell: (ord) => (
                <Button
                  size="sm"
                  variant="outline"
                  icon={Truck}
                  onClick={() => onNavigate('/logistics')}
                >
                  Track Transit
                </Button>
              ),
            },
          ]}
          data={(orders || []).filter((order) => order.buyerId === user?.uid || order.buyerId === 'buyer-001' || order.buyerId === 'current-buyer')}
          keyExtractor={(ord) => ord.id}
        />
      </Card>
    </div>
  );
};
