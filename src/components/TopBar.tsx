import React from "react";
import { AppBar, Toolbar, Button, IconButton, Typography, makeStyles, Theme } from "@material-ui/core"
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStylesTopBar = makeStyles((theme: Theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  }
}));

export function TopBar(props: { setDrawerOpen: (val: boolean) => void }) {
  const classes = useStylesTopBar();
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => props.setDrawerOpen(true)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="subtitle1" className={classes.title}>
          Trading UI
        </Typography>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          //onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}