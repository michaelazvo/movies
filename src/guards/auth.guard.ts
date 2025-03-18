import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { MessageService } from '../services/message.service';

export const authGuard: CanActivateFn = (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);
  const msgService = inject(MessageService)
  const ok = usersService.isLoggedIn();
  if(!ok){
    // return route.createUrlTree(['/login'])
    msgService.info("You need to log in  first.");
    usersService.navigateAfterLogin = state.url;
    router.navigateByUrl('/login');
  }
  return ok;
};
