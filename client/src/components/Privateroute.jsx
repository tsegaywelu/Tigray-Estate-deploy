import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentuser } = useSelector((state) => state.user);
  return (
    <div>
        <div>

        </div>
     
      {currentuser ? <Outlet /> : <Navigate to='/signin' />}
      <div>
        
      </div>
  
    </div>
  );
}
