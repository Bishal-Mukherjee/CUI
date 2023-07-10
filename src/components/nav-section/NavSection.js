import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { Icon } from '@iconify/react';
import { useObjContext } from '../../context/context';
import { StyledNavItem, StyledNavItemIcon } from './styles';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ ...other }) {
  const { user } = useObjContext();

  const navItems = [
    {
      title: 'Users',
      icon: <Icon icon={'teenyicons:users-solid'} width={20} />,
      path: 'users',
    },
    {
      title: 'Dashboard',
      icon: <Icon icon={'ic:baseline-dashboard'} width={20} />,
      path: 'panel',
    },
  ];

  const generateNavItems = () => {
    try {
      if (user.designation === 'Admin') {
        return navItems;
      }
      return [navItems[1]];
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {generateNavItems().map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: '#ffb703',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
        color: 'white',
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
