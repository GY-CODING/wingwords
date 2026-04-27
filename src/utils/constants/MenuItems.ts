'use client';

import React from 'react';
import { MenuIcons } from './MenuIcons';
import { MenuItem } from '@/domain/menu.model';

interface User {
  name?: string;
  picture?: string;
}

export const getMenuItems = (user: User | null): MenuItem[] => {
  if (user) {
    return [
      {
        text: 'Home',
        icon: React.createElement(MenuIcons.Home),
        route: '/',
      },
      {
        text: 'Library',
        icon: React.createElement(MenuIcons.Library),
        route: '/books',
      },
      {
        text: 'Community',
        icon: React.createElement(MenuIcons.Users),
        route: '/users/community',
      },
      {
        text: 'Profile',
        icon: React.createElement(MenuIcons.Profile),
        route: '/profile',
      },
    ];
  }

  return [
    {
      text: 'Inicio',
      icon: React.createElement(MenuIcons.Home),
      route: '/',
    },
    {
      text: 'Iniciar Sesión',
      icon: React.createElement(MenuIcons.Login),
      route: '/auth/login',
    },
  ];
};
