// to user of app
db.createUser({
  user: 'root',
  pwd: 'pass',
  roles: [
    {
      role: 'readWrite',
      db: 'link_tracker_starter',
    },
  ],
});
