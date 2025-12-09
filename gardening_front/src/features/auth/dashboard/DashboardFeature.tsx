
import useDashboardModel from './useDashboardModel';
import DashboardView from './DashboardView';

export default function DashboardFeature() {
  const { accessToken, handleLogout,userInfo,handleInactivate } = useDashboardModel();

  return <DashboardView accessToken={accessToken} onLogout={handleLogout} onInActivate={handleInactivate} userInfo={userInfo}/>;
}
