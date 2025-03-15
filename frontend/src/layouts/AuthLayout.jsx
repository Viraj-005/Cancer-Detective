import PropTypes from 'prop-types';

export const AuthLayout = ({ children }) => {
    return (
      <div className="auth-layout">
        <main>{children}</main>
      </div>
    );

};


AuthLayout.propTypes = {
    children: PropTypes.node.isRequired
};