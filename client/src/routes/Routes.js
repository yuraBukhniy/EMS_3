import React from 'react';
import HRRoutes from "./HRRoute";
import AdminRoute from "./AdminRoute";
import LeadRoutes from "./LeadRoutes";
import EmployeeRoutes from "./EmployeeRoute";
import ManagerRoute from "./ManagerRoute";

export default function Routes({role}) {
  switch (role) {
    case 'HR':
      return <HRRoutes />;
    case 'admin':
      return <AdminRoute />;
    case 'teamLead':
      return <LeadRoutes />;
    case 'employee':
      return <EmployeeRoutes/>;
    case 'manager':
      return <ManagerRoute/>
  }
}