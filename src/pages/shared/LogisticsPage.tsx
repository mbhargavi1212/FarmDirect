import React from 'react';
import { Truck, MapPin, CheckCircle2, Clock, ShieldCheck, Thermometer } from 'lucide-react';
import { MOCK_LOGISTICS } from '../../data/mockData';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

interface LogisticsPageProps {
  onNavigate: (path: string) => void;
}

export const LogisticsPage: React.FC<LogisticsPageProps> = ({ onNavigate }) => {
  const shipment = MOCK_LOGISTICS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            Cold-Chain & Fleet Logistics Tracker
          </h1>
          <Badge variant="info" size="sm" dot>Live GPS Active</Badge>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Real-time tracking of direct farm-to-buyer transit fleets with verified e-way bill compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Checkpoint Timeline */}
        <Card padding="lg" className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Consignment #{shipment.id}
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {shipment.originHub} → {shipment.destinationHub}
              </h2>
            </div>
            <Badge variant="info" size="md">
              IN TRANSIT • ON TIME
            </Badge>
          </div>

          {/* Timeline */}
          <div className="space-y-6 pl-4 border-l-2 border-emerald-500 relative">
            {shipment.checkpoints.map((cp, idx) => (
              <div key={idx} className="relative group">
                {/* Checkpoint Dot */}
                <div className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">{cp.location}</p>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(cp.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{cp.statusNote}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Col: Driver & Fleet Card */}
        <div className="space-y-6">
          <Card padding="md" className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Transit Vehicle & Driver
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Fleet Partner:</span>
                <span className="font-bold text-slate-800">{shipment.carrierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle Type:</span>
                <span className="font-bold text-slate-800">{shipment.vehicleType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registration:</span>
                <span className="font-mono font-bold text-slate-800">{shipment.vehicleNumber}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                SS
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">{shipment.driverName}</p>
                <p className="text-[11px] text-slate-500">{shipment.driverPhone}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
