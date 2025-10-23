import React from 'react';
import { AppBar, Box, Button, Stack, Toolbar } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';


const NAV_ITEMS = [
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/screens', label: 'Screens' },
];

const NavigationBar = () => {

  // read current location to determine active nav item.
  const location = useLocation();

  return (
    <AppBar
      position="sticky" 
      color="transparent"
      elevation={0} // remove default shadow for a flatter look
      sx={{
        // use theme background and divider
        backgroundColor: (theme) => theme.palette.background.default,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>

        {/* left section: branding/logo.*/}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            component="img"
            src="https://seeblindspot.com/wp-content/uploads/2024/05/blindspot.svg"
            alt="Blindspot logo"
            sx={{ height: 40, display: 'block' }}
          />
        </Stack>



        {/* flexible spacer pushes navigation buttons to the right */}
        <Box sx={{ flexGrow: 1 }} />



        {/* Right section: navigation buttons */}
        <Stack direction="row" spacing={1}>
          {NAV_ITEMS.map((item) => {

            // take location 
            const isActive = location.pathname === item.to;


            return (
              <Button
                key={item.to}
                component={RouterLink} // Render as a <a> like element that navigates via the router
                to={item.to}
                color={isActive ? 'primary' : 'inherit'}
                variant={isActive ? 'contained' : 'text'}
                sx={{ fontWeight: 600, color: isActive ? undefined : 'white',}}

                >{item.label}</Button>
            );
          })}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
