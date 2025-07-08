
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMosqueStore } from '@/store/mosqueStore';
import { Calendar, Filter, Download, Search } from 'lucide-react';
import { formatCurrency } from '@/utils/dates';

const DetailedReports: React.FC = () => {
  const { income, expenses, donors } = useMosqueStore();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all',
    searchTerm: ''
  });

  // Filter data based on criteria
  const filteredIncome = income.filter(item => {
    const matchesDate = (!filters.startDate || item.date >= filters.startDate) &&
                       (!filters.endDate || item.date <= filters.endDate);
    const matchesSearch = !filters.searchTerm || 
                         item.source.toLowerCase().includes(filters.searchTerm.toLowerCase());
    return matchesDate && matchesSearch;
  });

  const filteredExpenses = expenses.filter(item => {
    const matchesDate = (!filters.startDate || item.date >= filters.startDate) &&
                       (!filters.endDate || item.date <= filters.endDate);
    const matchesSearch = !filters.searchTerm || 
                         item.type.toLowerCase().includes(filters.searchTerm.toLowerCase());
    return matchesDate && matchesSearch;
  });

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Type,Date,Description,Amount\n" +
      filteredIncome.map(item => `Income,${item.date},${item.source},${item.amount}`).join("\n") + "\n" +
      filteredExpenses.map(item => `Expense,${item.date},${item.type},${item.amount}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `detailed-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>ফিল্টার</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="startDate">শুরুর তারিখ</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">শেষ তারিখ</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="type">ধরন</Label>
              <select
                id="type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">সব</option>
                <option value="income">আয়</option>
                <option value="expense">ব্যয়</option>
              </select>
            </div>
            <div>
              <Label htmlFor="search">খুঁজুন</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  className="pl-10"
                  placeholder="বিবরণ খুঁজুন..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={exportToCSV} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>CSV এক্সপোর্ট</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Income Table */}
      {(filters.type === 'all' || filters.type === 'income') && (
        <Card>
          <CardHeader>
            <CardTitle>আয়ের বিস্তারিত</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">তারিখ</th>
                    <th className="text-left py-2">উৎস</th>
                    <th className="text-left py-2">মাস</th>
                    <th className="text-right py-2">পরিমাণ</th>
                    <th className="text-left py-2">রসিদ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncome.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2">{new Date(item.date).toLocaleDateString('bn-BD')}</td>
                      <td className="py-2">{item.source}</td>
                      <td className="py-2">{item.month || '-'}</td>
                      <td className="py-2 text-right font-medium text-green-600">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="py-2">{item.receiptNumber}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-bold">
                    <td colSpan={3} className="py-2">মোট:</td>
                    <td className="py-2 text-right text-green-600">
                      {formatCurrency(filteredIncome.reduce((sum, item) => sum + item.amount, 0))}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expense Table */}
      {(filters.type === 'all' || filters.type === 'expense') && (
        <Card>
          <CardHeader>
            <CardTitle>ব্যয়ের বিস্তারিত</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">তারিখ</th>
                    <th className="text-left py-2">ধরন</th>
                    <th className="text-left py-2">বিবরণ</th>
                    <th className="text-left py-2">মাস</th>
                    <th className="text-right py-2">পরিমাণ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2">{new Date(item.date).toLocaleDateString('bn-BD')}</td>
                      <td className="py-2">{item.type}</td>
                      <td className="py-2">{item.description || '-'}</td>
                      <td className="py-2">{item.month || '-'}</td>
                      <td className="py-2 text-right font-medium text-red-600">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-bold">
                    <td colSpan={4} className="py-2">মোট:</td>
                    <td className="py-2 text-right text-red-600">
                      {formatCurrency(filteredExpenses.reduce((sum, item) => sum + item.amount, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailedReports;
