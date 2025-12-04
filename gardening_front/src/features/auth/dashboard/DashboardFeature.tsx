
import useDashboardModel from './useDashboardModel';
import DashboardView from './DashboardView';

export default function DashboardFeature() {
  const { accessToken, refreshToken, handleLogout,userInfo,handleInactivate } = useDashboardModel();

  return <DashboardView accessToken={accessToken} refreshToken={refreshToken} onLogout={handleLogout} onInActivate={handleInactivate} userInfo={userInfo}/>;
}
