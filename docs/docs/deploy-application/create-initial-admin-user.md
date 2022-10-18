---
sidebar_position: 3
---

# Create the initial admin user

First of all, login into the container and create the super user for the admin dashboard following the on screen steps:

```bash
docker run \
  -it \
  -v $HOME/buho-prod/media/:/usr/src/media:rw \
  -v $HOME/buho-prod/data/:/usr/src/app/config:rw \
  bocabitlabs/buho-stocks:latest \
  bash
```

```bash
python manage.py createsuperuser
```

Once created, go to `/admin/` and login. You will be prompted to set up the 2FA for your account. After setting it up, you will be redirected to the "Account Security" page, where you can get your recovery codes or disable 2 factor authentication.

If you access `/admin/` again, you will be able to access the admin panel.

