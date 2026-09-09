import React from 'react';
import { TrendingUp, Package, ShoppingBag, CreditCard, Plus, ArrowRight, Truck, Sparkles, } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedProduct } from '../../utils/productLocalization';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
export const FarmerDashboard = ({ onNavigate }) => {
    const { user } = useAuth();
    const { formatCurrency, products, orders } = useApp();
    const { language, t } = useLanguage();
    const farmerProducts = (products || []).filter((p) => p.farmerId === user?.uid || p.farmerId === 'farmer-001');
    const activeOrders = (orders || []).filter((o) => o.farmerId === user?.uid || o.farmerId === 'farmer-001');
    return (<div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 font-heading">
              Hello, {user?.displayName}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {user?.farmDetails?.farmName || 'Narmada Valley Organic Agro'} • {user?.district}, {user?.state}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={TrendingUp} onClick={() => onNavigate('/fair-price')}>
            Check Fair Price
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => onNavigate('/farmer/products')}>
            List Harvest Lot
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Wallet Balance" value={formatCurrency(user?.walletBalance ?? 0)} subtext="Ready for direct UPI / NEFT withdrawal" icon={CreditCard} accentColor="emerald"/>
        <StatCard label="Active Harvest Lots" value={farmerProducts.length} subtext="Total available: 12,500 kg" icon={Package} accentColor="indigo"/>
        <StatCard label="Pending Contract Orders" value={activeOrders.length} subtext="1 in transit, 1 completed" icon={ShoppingBag} accentColor="amber"/>
        <StatCard label="Intermediary Fee Saved" value={formatCurrency(29600)} trend={{ value: '+28.4%', isPositive: true }} subtext="Bypassed APMC commission cut" icon={TrendingUp} accentColor="emerald"/>
      </div>

      {/* Active Orders Section */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Incoming Procurement Contracts
            </h2>
            <p className="text-xs text-slate-500">Orders secured with verified escrow funds</p>
          </div>
          <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => onNavigate('/farmer/orders')}>
            View All
          </Button>
        </div>

        <Table columns={[
            {
                header: 'Order #',
                accessorKey: 'orderNumber',
                cell: (ord) => (<div>
                  <p className="font-bold text-slate-900">{ord.orderNumber}</p>
                  <p className="text-[11px] text-slate-400">Created {new Date(ord.createdAt).toLocaleDateString('en-IN')}</p>
                </div>),
            },
            {
                header: 'Buyer',
                accessorKey: 'buyerName',
                cell: (ord) => (<div>
                  <p className="font-semibold text-slate-800">{ord.buyerName}</p>
                  <p className="text-[11px] text-slate-500 capitalize">{ord.buyerType} buyer</p>
                </div>),
            },
            {
                header: 'Produce & Qty',
                cell: (ord) => (<div>
                  <p className="font-medium text-slate-800">{ord.items[0]?.cropName}</p>
                  <p className="text-[11px] text-slate-500">{ord.totalQuantityKg.toLocaleString('en-IN')} kg</p>
                </div>),
            },
            {
                header: 'Escrow Payout',
                cell: (ord) => (<div>
                  <p className="font-bold text-emerald-700">{formatCurrency(ord.itemsSubtotal)}</p>
                  <span className="text-[10px] text-emerald-600 font-medium">₹0 broker commission</span>
                </div>),
            },
            {
                header: 'Status',
                cell: (ord) => {
                    const isTransit = ord.status === 'in_transit';
                    return (<Badge variant={isTransit ? 'info' : 'success'} size="sm">
                    {isTransit ? 'Dispatched / In Transit' : 'Delivered & Paid'}
                  </Badge>);
                },
            },
            {
                header: 'Action',
                cell: (ord) => (<Button size="sm" variant="outline" icon={Truck} onClick={() => onNavigate('/logistics')}>
                  Track Fleet
                </Button>),
            },
        ]} data={activeOrders} keyExtractor={(ord) => ord.id}/>
      </Card>

      {/* Produce Inventory & AI Demand banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listings summary */}
        <Card padding="md" className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Current Listed Crops
            </h2>
            <Button variant="outline" size="sm" onClick={() => onNavigate('/farmer/products')}>
              Manage Listings
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {farmerProducts.map((p) => {
            const loc = getLocalizedProduct(p, language);
            return (<div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      <img src={p.images[0]} alt={loc.cropName} referrerPolicy="no-referrer" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{loc.title}</p>
                      <p className="text-xs text-slate-500">
                        {loc.variety} • {loc.grade}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-700">
                      {formatCurrency(p.pricePerKg)}{loc.unitPriceLabel}
                    </p>
                    <p className="text-xs text-slate-500">
                      {loc.quantityAvailable} {language === 'te' ? 'మిగిలి ఉంది' : language === 'hi' ? 'शेष' : 'left'}
                    </p>
                  </div>
                </div>);
        })}
          </div>
        </Card>

        {/* AI Harvest & Demand Tip */}
        <Card padding="md" className="border-emerald-200 bg-emerald-50/40 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600"/>
              <span>AI Crop Demand Forecast</span>
            </div>
            <h3 className="font-bold text-slate-900 text-base leading-snug">
              High Demand Surge Expected for Onions & Wheat in Western Hubs
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on APMC arrivals and seasonal deficits, forward contracts for April harvest are trending +18% above typical mandi minimums.
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={() => onNavigate('/ai-demand')} className="w-full">
            Explore AI Demand Forecasts
          </Button>
        </Card>
      </div>
    </div>);
};
