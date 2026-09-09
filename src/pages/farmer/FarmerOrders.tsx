import React from 'react';
import { ShoppingBag, Truck, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';

interface FarmerOrdersProps {
  onNavigate: (path: string) => void;
}

export const FarmerOrders: React.FC<FarmerOrdersProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { formatCurrency, orders } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">
          Orders & Procurement Contracts
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          All contracts are 100% pre-funded into Smart Escrow before farm dispatch
        </p>
      </div>

      <Table
        columns={[
          {
            header: 'Contract ID',
            cell: (ord) => (
              <div>
                <p className="font-bold text-slate-900">{ord.orderNumber}</p>
                <p className="text-[11px] text-slate-400">{new Date(ord.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            ),
          },
          {
            header: 'Buyer Details',
            cell: (ord) => (
              <div>
                <p className="font-bold text-slate-800">{ord.buyerName}</p>
                <p className="text-[11px] text-slate-500">{ord.buyerPhone}</p>
              </div>
            ),
          },
          {
            header: 'Produce Ordered',
            cell: (ord) => (
              <div>
                <p className="font-semibold text-slate-900">{ord.items[0]?.productTitle}</p>
                <p className="text-xs text-slate-500">
                  {ord.totalQuantityKg.toLocaleString('en-IN')} kg @ {formatCurrency(ord.items[0]?.pricePerKg)}/kg
                </p>
              </div>
            ),
          },
          {
            header: 'Settlement Amount',
            cell: (ord) => (
              <div>
                <p className="font-bold text-emerald-700">{formatCurrency(ord.itemsSubtotal)}</p>
                <p className="text-[10px] text-emerald-600 font-semibold">
                  Saved ₹{(ord.traditionalMandiIntermediaryCut ?? 0).toLocaleString('en-IN')} broker cut
                </p>
              </div>
            ),
          },
          {
            header: 'Escrow Status',
            cell: (ord) => (
              <Badge
                variant={ord.paymentStatus === 'escrow_held' ? 'warning' : 'success'}
                size="sm"
              >
                {ord.paymentStatus === 'escrow_held' ? 'Escrow Locked (Safe)' : 'Paid to Bank'}
              </Badge>
            ),
          },
          {
            header: 'Action',
            cell: (ord) => (
              <Button
                variant="outline"
                size="sm"
                icon={Truck}
                onClick={() => onNavigate('/logistics')}
              >
                Logistics & GPS
              </Button>
            ),
          },
        ]}
        data={(orders || []).filter((order) => order.farmerId === user?.uid || order.farmerId === 'farmer-001')}
        keyExtractor={(ord) => ord.id}
      />
    </div>
  );
};
