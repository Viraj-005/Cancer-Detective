import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const MainLayout = ({ children }) => {
  const handleProfileClick = () => {
    // Handle profile click logic here
    console.log("Profile clicked!");
  };
  return (
    <>
      <Navbar onProfileClick={handleProfileClick} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

MainLayout.propTypes = {
    children: PropTypes.node.isRequired
  };