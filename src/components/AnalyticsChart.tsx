"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, Award, DollarSign, ArrowUpRight, BarChart3, PieChart as PieIcon, LineChart as LineIcon, TrendingUp } from "lucide-react";

// Data
const partnerData = [
  { date: "Week 1", Enrollments: 12, Certificates: 5, Earnings: 350 },
  { date: "Week 2", Enrollments: 24, Certificates: 14, Earnings: 720 },
  { date: "Week 3", Enrollments: 18, Certificates: 19, Earnings: 540 },
  { date: "Week 4", Enrollments: 35, Certificates: 28, Earnings: 1050 },
];

const metricsConfig = {
  Enrollments: { label: "Partner Enrollments", total: "89 Students", change: "+12%", color: "#3b82f6", icon: Users },
  Certificates: { label: "Certificates Signed", total: "66 Issued", change: "+8%", color: "#8b5cf6", icon: Award },
  Earnings: { label: "Partner Share Earnings", total: "$2,660.00", change: "+22%", color: "#10b981", icon: DollarSign },
};

type MetricKey = keyof typeof metricsConfig;
type ChartType = "area" | "line" | "bar" | "pie" | "histogram";

const chartTypes = [
  { type: "area", label: "Area", icon: TrendingUp },
  { type: "line", label: "Line", icon: LineIcon },
  { type: "bar", label: "Bar", icon: BarChart3 },
  { type: "histogram", label: "Histogram", icon: BarChart3 },
  { type: "pie", label: "Pie", icon: PieIcon },
] as const;

export default function AnalyticsChart() {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("Enrollments");
  const [chartType, setChartType] = useState<ChartType>("area");

  const currentMetric = metricsConfig[activeMetric];
  const Icon = currentMetric.icon;

  // For Pie Chart - Transform data
  const pieData = partnerData.map((item, index) => ({
    name: item.date,
    value: item[activeMetric],
    fill: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"][index % 4],
  }));

  const renderChart = () => {
    const commonProps = {
      data: partnerData,
      margin: { top: 10, right: 10, left: -20, bottom: 0 },
    };

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={activeMetric}
              stroke={currentMetric.color}
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        );

      case "bar":
      case "histogram":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey={activeMetric} fill={currentMetric.color} radius={6} />
          </BarChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              dataKey="value"
              label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      case "area":
      default:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={currentMetric.color}
              strokeWidth={3}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
      {/* Header + Chart Type Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track partner activity and earnings</p>
        </div>

        {/* Chart Type Buttons */}
        <div className="flex bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
          {chartTypes.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                chartType === type
                  ? "bg-white dark:bg-gray-800 shadow text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {(Object.keys(metricsConfig) as MetricKey[]).map((key) => {
          const config = metricsConfig[key];
          const MetricIcon = config.icon;
          const isSelected = activeMetric === key;

          return (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`flex flex-col p-4 rounded-2xl border transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <MetricIcon className="h-5 w-5" style={{ color: config.color }} />
                <span className="text-xs font-medium text-gray-400">{config.label}</span>
              </div>
              <div className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                {config.total}
              </div>
              <div className="flex items-center text-emerald-600 text-sm mt-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {config.change} this month
              </div>
            </button>
          );
        })}
      </div>

      {/* Chart Container */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}