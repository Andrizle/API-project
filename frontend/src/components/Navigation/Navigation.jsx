import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navBar'>
        <NavLink className='navLink' id='homeButton' to="/">Home</NavLink>
        <div>
          <NavLink className='navLink' to="/spots/new">Create A New Spot</NavLink>
          {isLoaded && (
          <ProfileButton className='navLink' user={sessionUser} />
      )}
        </div>

    </div>
  );
}

export default Navigation;
