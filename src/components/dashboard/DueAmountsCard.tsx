
import React from 'react';
import { AlertTriangle, Users, User } from 'lucide-react';
import { useMosqueStore } from '@/store/mosqueStore';

const DueAmountsCard: React.FC = () => {
  const { donors, income, expenses, imam } = useMosqueStore();
  
  // Calculate donor dues
  const donorDues = donors.filter(donor => {
    const missingMonths = getMissingMonths(donor.id);
    return missingMonths.length > 0;
  }).map(donor => ({
    name: donor.name,
    dueMonths: getMissingMonths(donor.id).length,
    dueAmount: getMissingMonths(donor.id).length * donor.monthlyAmount
  }));

  function getMissingMonths(donorId: string) {
    const donor = donors.find(d => d.id === donorId);
    if (!donor) return [];
    
    const startDate = new Date(donor.startDate);
    const currentDate = new Date();
    const paidMonths = income
      .filter(i => i.donorId === donorId && i.source === 'Monthly Donation')
      .map(i => i.month || '');
    
    const missingMonths: string[] = [];
    const date = new Date(startDate);
    
    while (date <= currentDate) {
      const monthYear = `${date.toLocaleDateString('en-US', { month: 'long' })} ${date.getFullYear()}`;
      if (!paidMonths.includes(monthYear)) {
        missingMonths.push(monthYear);
      }
      date.setMonth(date.getMonth() + 1);
    }
    
    return missingMonths;
  }

  // Calculate imam salary dues by checking expenses instead of income
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const imamSalaryPaid = expenses.some(e => 
    e.type === 'Imam Salary' && 
    e.month === currentMonth
  );

  const totalDonorDues = donorDues.reduce((sum, donor) => sum + donor.dueAmount, 0);
  const imamDue = !imamSalaryPaid && imam.length > 0 ? imam[0].monthlySalary : 0;

  return (
    <div className="bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-red-500/20 p-3 rounded-full border border-red-400/30">
          <AlertTriangle className="h-6 w-6 text-red-300" />
        </div>
        <h3 className="text-xl font-bold text-red-300">বকেয়া হিসাব</h3>
      </div>

      <div className="space-y-4">
        {/* Donor dues */}
        <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Users className="h-5 w-5 text-red-300" />
            <h4 className="font-semibold text-red-300">দাতাদের বকেয়া</h4>
          </div>
          
          {donorDues.length > 0 ? (
            <div className="space-y-2">
              {donorDues.slice(0, 5).map((donor, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{donor.name}</span>
                  <div className="text-right">
                    <div className="text-red-300 font-medium">৳{donor.dueAmount.toLocaleString()}</div>
                    <div className="text-gray-400 text-xs">{donor.dueMonths} মাস</div>
                  </div>
                </div>
              ))}
              {donorDues.length > 5 && (
                <div className="text-gray-400 text-sm text-center">
                  আরো {donorDues.length - 5} জন...
                </div>
              )}
              <div className="border-t border-red-400/20 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-red-300">
                  <span>মোট বকেয়া:</span>
                  <span>৳{totalDonorDues.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">কোন দাতার বকেয়া নেই</p>
          )}
        </div>

        {/* Imam salary due */}
        <div className="bg-orange-500/10 border border-orange-400/20 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <User className="h-5 w-5 text-orange-300" />
            <h4 className="font-semibold text-orange-300">ইমামের বেতন</h4>
          </div>
          
          {imamDue > 0 ? (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">{currentMonth}</span>
              <span className="text-orange-300 font-medium">৳{imamDue.toLocaleString()}</span>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">এই মাসের বেতন পরিশোধিত</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DueAmountsCard;
